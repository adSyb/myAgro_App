function paychart(name, goals, counts){

	$( "#payname" ).val( name ); //label tab
	$("#paychart1,#paychart2").html(""); //clear old charts
	
	//{group: 'Total', alloc: 'alloc', goal: 'goal - alloc', percent: 'alloc / goal - alloc'},
	var data1 = [{group: 'Women, large', alloc: goals[9], goal: (goals[5]-goals[9])},
			{group: 'Women, small', alloc: goals[8], goal: (goals[4]-goals[8])},
			{group: 'Women', alloc: (goals[8]+goals[9]), goal: ((goals[4]+goals[5])-(goals[8]+goals[9]))},
			{group: 'Men, large', alloc: goals[7], goal: (goals[3]-goals[7])},
			{group: 'Men, small', alloc: goals[6], goal: (goals[2]-goals[6])},
			{group: 'Men', alloc: (goals[6]+goals[7]), goal: ((goals[2]+goals[3])-(goals[6]+goals[7]))},
			{group: 'Total', alloc: goals[1], goal: (goals[0]-goals[1])}];

	
	var w = 500, h = 225, c = "#paychart1", t = "CFA Goal";
	createChart(data1,w,h,c,t);
	
	var data2 = [{group: 'Women', alloc: counts[5], goal: (counts[4]-counts[5])},
			{group: 'Men', alloc: counts[3], goal: (counts[2]-counts[3])},
			{group: 'Total', alloc: counts[1], goal: (counts[0]-counts[1])}];
	
	var w = 500, h = 125, c = "#paychart2", t = "# of Clients";
	createChart(data2,w,h,c,t);
	
function createChart(data,width,height,chart,title){
	var margin = {top: 0, right: 60, bottom: 40, left: 100},
		width = w - margin.left - margin.right,
		height = h - margin.top - margin.bottom;

	var y = d3.scale.ordinal()
		.rangeRoundBands([height, 0], .1);

	var x = d3.scale.linear()
		.rangeRound([0, width]);

	var color = d3.scale.ordinal()
		//.domain(["alloc","goal"])
		.range(["#5b5bd7", "#adadeb"]);
		
	var border = d3.scale.ordinal()
		.domain(["alloc","goal"])
		.range(["#fff", "rgba(0, 0, 0, 0)"]);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(5, "s");

	var svg = d3.select(chart).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	


	color.domain(d3.keys(data[0]).filter(function(key) { return key !== "group"; }));

	data.forEach(function(d) {
		var y0 = 0;
		d.ages = color.domain().map(function(name) { 
			return {name: name,
				y0: y0,
				y1: y0 += +d[name],
			}; 
		});
		d.total = d.ages[1].y1;
		d.half = d.ages[0].y1;
		d.goal = d.ages[1].y1 - d.ages[0].y1;
	});


	y.domain(data.map(function(d) { return d.group; }));
	x.domain([0, d3.max(data, function(d) { return d.total; })]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("x", width)
		.attr("y", 35)
	//	.attr("dx", ".71em")
		.style("text-anchor", "end")
		.text(title);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	var bar = svg.selectAll(".bar")
		.data(data)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) { return "translate(0," + y(d.group) + ")"; });

	bar.selectAll("rect")
		.data(function(d) { return d.ages; })
		.enter().append("rect")
		.attr("height", y.rangeBand())
		.attr("x", function(d) { return x(d.y0); })
		.attr("width", function(d) { return x(d.y1) - x(d.y0); })
		.style("fill", function(d) { return color(d.name); })
		.style("stroke", function(d) { return border(d.name); })
		.style("stroke-width", .5);


	svg.selectAll(".bartext")
		.data(data)
		.enter().append("text")
		.attr("class", "bartext")
		.text(function(d){
			if (d.goal == 0){return "";}
			else if (d.alloc == 0){return "0%";}
			else if (d.alloc == null){return "0%";}
			else{return String(Math.floor(parseInt(d.alloc) / (parseInt(d.alloc) + parseInt(d.goal)) * 100)) + "%";}
		})
		.attr("x", function(d) {
			var out, size = x(d.goal);
			if (size < 30){out = x(d.total) + 5;}else{out = x(d.half) + 5;}
			return (out);
		
		})
		.attr("transform", function(d) { 
			return "translate(0," + (y(d.group) + 14) + ")"; });
}
}