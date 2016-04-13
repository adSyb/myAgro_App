function sunburst(name,packets){
	
	$( "#packname" ).val( name ); //label chart
	$("#chart1").html(""); //clear old chart
	
	//define data for chart from map click
	var root = JSON.parse('{"name": "All Packets", "size": ' + packets[0] + ', "label": "Total", "children": [{"name": "Corn", "size" : ' + (packets[1] + packets[2] + packets[3] + packets[4]) + ', "label": "Corn","children": [{"name": "Corn - Male", "size" : ' + (packets[1] + packets[2]) + ', "label": "Male","children": [{"name": "Corn - Male, small","size": ' + packets[1] + ', "label": "Small"},{"name": "Corn - Male, large","size": ' + packets[2] + ', "label": "Large"}]},{"name": "Corn - Female", "size" : ' + (packets[3] + packets[4]) + ', "label": "Female","children": [{"name": "Corn - Female, small","size": ' + packets[3] + ', "label": "Small"},{"name": "Corn - Female, large","size": ' + packets[4] + ', "label": "Large"}]}]},{"name": "Peanut", "size" : ' + (packets[5] + packets[6] + packets[7] + packets[8]) + ', "label": "Peanut","children": [{"name": "Peanut - Male", "size" : ' + (packets[5] + packets[6]) + ', "label": "Male","children": [{"name": "Peanut - Male, small","size": ' + packets[5] + ', "label": "Small"},{"name": "Peanut - Male, large","size": ' + packets[6] + ', "label": "Large"}]},{"name": "Peanut - Female", "size" : ' + (packets[7] + packets[8]) + ', "label": "Female","children": [{"name": "Peanut - Female, small","size": ' + packets[7] + ', "label": "Small"},{"name": "Peanut - Female, large","size": ' + packets[8] + ', "label": "Large"}]}]},{"name": "Garden", "size" : ' + (packets[9] + packets[10]) + ', "label": "Garden","children": [{"name": "Garden - Male","size": ' + packets[9] + ', "label": "Male"},{"name": "Garden - Female","size": ' + packets[10] + ', "label": "Female"}]},{"name": "Semoir and Service", "size" : ' + (packets[11] + packets[12]) + ', "label": "Semoir","children": [{"name": "Semoir","size": ' + packets[11] + ', "label": "Semoir"},{"name": "Service","size": ' + packets[12] + ', "label": "Service"}]}]}');


	
	var width = 350, height = 380, radius = 175;
	var x = d3.scale.linear()
		.range([0, 2 * Math.PI]);
	var y = d3.scale.sqrt()
		.range([0, radius]);

	var color = d3.scale.ordinal()
		.domain(["All Packets","Corn","Corn - Male","Corn - Male, small","Corn - Male, large","Corn - Female","Corn - Female, small","Corn - Female, large","Peanut","Peanut - Male","Peanut - Male, small","Peanut - Male, large","Peanut - Female","Peanut - Female, small","Peanut - Female, large","Garden","Garden - Male","Garden - Female","Semoir and Service","Semoir","Service"])
		.range(["#aaa","#8c6d31","#bd9e39","#e7cb94","#e7ba52","#bd7a3c","#ef9f55","#d78b44","#393b79","#478793","#72cfe0","#4fa9b9","#5254a3","#9c9ede","#6b6ecf","#637939","#8ca252","#b5cf6b","#843c39","#843c39","#d6616b"]);

	var svg = d3.select("#chart1").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");
		
	var tooltip = d3.select("body")
		.append("div")
		.attr("class", "tooltip")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden");

	var partition = d3.layout.partition()
		.sort(null)
		.value(function(d) { return d.size; });

	var arc = d3.svg.arc()
		.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
		.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
		.innerRadius(function(d) { return Math.max(0, y(d.y)); })
		.outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

	// Keep track of the node that is currently being displayed as the root.
	var node;
	node = root;
	var path = svg.datum(root).selectAll("path")
		.data(partition.nodes)
		.enter().append("path")
		.attr("d", arc)
		.style("fill", function(d) { return color(d.name); })
		.style("stroke", "#fff")
		.on("click", click)
		.on("mouseover", function(d)
			{return tooltip.style("visibility", "visible").text(d.label + ": " + d.size);})
		.on("mousemove", function(d)
			{return tooltip
				.style("top", (d3.event.pageY-10)+"px")
				.style("left", (d3.event.pageX+10)+"px");
			}
		)
		.on("mouseout", function(){return tooltip.style("visibility", "hidden");})

	function click(d) {
		console.log(color(d.name));
		node = d;
		path.transition()
			.duration(1000)
			.attrTween("d", arcTweenZoom(d));
	}

	// When zooming: interpolate the scales.
	function arcTweenZoom(d) {
		var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
			yd = d3.interpolate(y.domain(), [d.y, 1]),
			yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
		return function(d, i) {
			return i
				? function(t) { return arc(d); }
				: function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
		};
	}
}