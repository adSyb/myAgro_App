window.onload = function() {

function defaultStyle(feature) {
    return {
        fillColor: 'gray',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.2,
    };
}

function invisibleStyle(feature) {
    return {
        weight: 3,
        opacity: 0,
        color: 'white',
    };
}

var invisibleMarker = {
    radius: 0,
    opacity: 0,
    fillOpacity: 0
};

var defaultMarker = {
    radius: 5,
	fillColor: '#666',
	color: 'white',
	weight: 1,
    opacity: 1,
    fillOpacity: 1
};

var c = L.geoJson(village, {pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, defaultMarker)
	}, onEachFeature: onEachFeature}),
	a = L.geoJson(zones, {style: defaultStyle, onEachFeature: onEachFeature}),
	b = L.geoJson(agents, {style: defaultStyle, onEachFeature: onEachFeature});
	
//basemap definition
var basemap = L.tileLayer( 'http://c.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
    subdomains: ['otile1','otile2','otile3','otile4']
});

//initialize map
var bounds = L.latLngBounds(L.latLng(9,-19),L.latLng(17,0));
var map = L.map('base', {
	center: [12.30, -7.80], 
	minZoom: 8, maxZoom: 13, 
	zoom: 10, 
	maxBounds: bounds, 
	layers: [basemap,c]
});


var d = L.geoJson(village, {pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, invisibleMarker)
			.bindLabel(feature.properties.Village, {
				noHide: true,
				direction: 'right',
				offset: [15,-13]
			})
	}});/* ,
	e = L.geoJson(agents, {style: invisibleStyle, onEachFeature: function(feature, layer) {
		layer.bindLabel(feature.properties.Agent,{ noHide: true });
		layer.on('mouseover', function () { this.setStyle({ weight: 3 }); });
		layer.on('mouseout', function () { this.setStyle({ opacity: 0 }); });
	}}),
	f = L.geoJson(zones, {style: invisibleStyle, onEachFeature: function(feature, layer) {
		layer.bindLabel(feature.properties.Zone,{ noHide: true });
		layer.on('mouseover', function () { this.setStyle({ opacity: 1 }); });
		layer.on('mouseout', function () { this.setStyle({ opacity: 0 }); });
	}}); */

var overlays = {
	"Zones": a,
	//"Zone Labels (on hover)": f, 
	"Agents": b, 
	//"Agent Labels (on hover)": e, 
	"Village Labels": d, "Villages": c };

L.control.layers(null, overlays, {position: "topleft", autoZIndex: false}).addTo(map);

L.control.scale({position: "bottomleft"}).addTo(map);

var Legend = L.Control.extend({
	options: {position: 'topright'},
	//initialize: function(options){},
	onAdd: function (map) {
		var div = L.DomUtil.create('div', 'legend'),
			labels = [];
		div.innerHTML += legName + ' - ' + layerName + '<br>';
		if (layerName == "Village"){
			for (var i = 0; i < 4; i++) {
				div.innerHTML +=
					'<div style="position:relative;left:0px;display:inline-block;height:' + (getRadius(breaks[i] - 1)*2) + 'px; width:' + (getRadius(breaks[i] - 1)*2) + 'px; border: 0px solid #fff; border-radius:' + getRadius(breaks[i] - 1) + 'px; background:' + getColor1(breaks[i] - 1) + ';opacity: 0.7;"></div><div style="position:absolute;display:inline-block;padding-left:5px;height:' + (getRadius(breaks[i] - 1)*2) + 'px;line-height:' + (getRadius(breaks[i] - 1)*2) + 'px;"> ' + (i == 0 ? 'less than ' + addCommas(breaks[i]) + '</div><br>' :  addCommas(breaks[i - 1]) + ' &ndash; ' + addCommas(breaks[i]) + '</div><br>');
			}
			div.innerHTML += '<div style="position:relative;left:0px;display:inline-block;height:' + (getRadius(breaks[3] + 1)*2) + 'px; width:' + (getRadius(breaks[3] + 1)*2) + 'px;border: 0px solid #fff; border-radius:' + getRadius(breaks[3] + 1) + 'px;background:' + getColor1(breaks[3] + 1) + ';opacity: 0.7;"></div><div style="position:absolute;display:inline-block;padding-left:5px;height:' + (getRadius(breaks[i] - 1)*2) + 'px;line-height:' + (getRadius(breaks[i] - 1)*2) + 'px;"> over ' + addCommas(breaks[3]) + '</div>';
			console.log(div.innerHTML);
		}
		else{
			for (var i = 0; i < 4; i++) {
				div.innerHTML +=
					'<i style="background:' + getColor1(breaks[i] - 1) + '"></i> ' + (i == 0 ? 'less than ' + addCommas(breaks[i]) + '<br>' :  addCommas(breaks[i 	- 1]) + ' &ndash; ' + addCommas(breaks[i] - 1) + '<br>');
			}
			div.innerHTML += '<i style="background:' + getColor1(breaks[3] + 1) + '"></i> over ' + addCommas(breaks[3]);
		}
		return div;
	},
	onRemove: function (map){
		breaks = "";
	}
});

function addCommas(x) {
	var check = x.toString().length;
	if (check > 6){
		x = Math.floor(x / 10000);
		x = x / 100;
		out = x.toString() + "M";
	}
	else if (check > 4){
		x = Math.floor(x / 1000);
		out = x.toString() + "k";
	}
	else{out = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}
    return out;
}

//define color of feature based on breaks
function getColor1(d) {
	return d == null ? 'rgba(0,0,0,0.2)':
			d < breaks[0]	? '#68e485' :
			d < breaks[1]	? '#3ccf5e' :
			d < breaks[2]	? '#23a242' :
			d < breaks[3]	? '#218439' :
							'#165726' ;
}

function getRadius(d) {
	return d == null ? 0:
		d < 1			? 0:
		d < breaks[0]	? 8 :
		d < breaks[1]	? 12 :
		d < breaks[2]	? 16 :
		d < breaks[3]	? 20 :
						24 ;
}

//define style of cloropleth
function style1(feature) {	
    return {
        fillColor: getColor1(feature.properties[dispValue]),
		radius: getRadius(feature.properties[dispValue]),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.8
    };
}
/* function markerStyle(feature) {	
    return {
        fillColor: getColor1(feature.properties[dispValue]),
		radius: getRadius(feature.properties[dispValue]),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.8
    };
} */


//initialize variables
var villagelist = [], distancelist = [], Lines = L.layerGroup(); 
var distance, end, name, start, html, packets, goals, counts;



//on each feature function click events- used for creating content in side pages.
function onEachFeature(feature, layer) {
	layer.on('click', function(e){
		Lines.clearLayers();
		resetSwitch = true;
		
		if (payon == true || packon == true){
			if (feature.properties.Village){
				name = "Village: " + e.target.feature.properties.Village;
			}
			else if (feature.properties.Agent){
				name = "Agent: " + e.target.feature.properties.Agent;
			}
			else{
				name = "Zone: " + e.target.feature.properties.Zone;
			}
			goals = [e.target.feature.properties.Goal, e.target.feature.properties.Alloc, e.target.feature.properties.MSGoal, e.target.feature.properties.MLGoal, e.target.feature.properties.FSGoal, e.target.feature.properties.FLGoal, e.target.feature.properties.MSAlloc, e.target.feature.properties.MLAlloc, e.target.feature.properties.FSAlloc, e.target.feature.properties.FLAlloc];
			counts = [e.target.feature.properties.CCount, e.target.feature.properties.CFCount, e.target.feature.properties.MCount, e.target.feature.properties.MFCount, e.target.feature.properties.FCount, e.target.feature.properties.FFCount];
			paychart(name, goals, counts);
			packets = [e.target.feature.properties.Npac, e.target.feature.properties.MSMais, e.target.feature.properties.MLMais, e.target.feature.properties.FSMais, e.target.feature.properties.FLMais, e.target.feature.properties.MSArac, e.target.feature.properties.MLArac, e.target.feature.properties.FSArac, e.target.feature.properties.FLArac, e.target.feature.properties.MMara, e.target.feature.properties.FMara, e.target.feature.properties.Semoir, e.target.feature.properties.SemSer];
			sunburst(name,packets);
			if (payon == true){$("#payscroll").css("display", "block");}
			else{$("#packscroll").css("display", "block");}
		}
		else if (diston == true){
			if (feature.properties.Village){
				name = e.target.feature.properties.Village;
				$( ".distance" ).empty();
				$( "#distname" ).val( name );
				
				start = L.latLng(e.target.feature.geometry.coordinates[1],e.target.feature.geometry.coordinates[0]);
				villagelist = [];
				distancelist = [];
				
				for (i=0;i<(village[0].features.length);i++){
					end = L.latLng(village[0].features[i].geometry.coordinates[1],village[0].features[i].geometry.coordinates[0]);
					
					distance = start.distanceTo(end);
					if (distance < 10000){
						villagelist.push([village[0].features[i].properties.Village, Math.round(distance / 10)/100]);
						Lines.addLayer(L.polyline([start,end],{color:'#666', weight: 2, opacity: .5, dashArray:'5, 5', clickable: true}));
					}
					
				}
				
				Lines.addTo(map);
				
				villagelist.sort(function(a,b) {
					return a[1]-b[1]
				});
				
				villagelist.shift();
				
				html = '<table style="margin-top:80px;width:200px;color:#555;"><tr><td><b>Neighboring Villages</b></td></tr>';
				for (var i = 0; i < villagelist.length; i++) {
					html += '<tr>';
					html += '<td>' + villagelist[i][0] + '</td><td>' + villagelist[i][1] + ' km</td>';
					html += "</tr>";
				}
				html += '</table>';
				
				$( ".distance" ).append( html );
			}
			else {
				//print select village
			}
		}
		else{
			//call functions
		}
	});
	
	if (feature.properties.Village){}
	else if (feature.properties.Agent){
		layer.bindLabel(feature.properties.Agent,{ noHide: true });
		layer.on('mouseover', function () { this.setStyle({ weight: 3 }); });
		layer.on('mouseout', function () { this.setStyle({ weight: 1 }); });
	}
	else{
		layer.bindLabel(feature.properties.Zone,{ noHide: true });
		layer.on('mouseover', function () { this.setStyle({ weight: 3 }); });
		layer.on('mouseout', function () { this.setStyle({ weight: 1 }); });
	}
} //end on each feature

//clear button handler
$("#clearbtn").on("click", function(e){
	e.preventDefault();
	a.setStyle(defaultStyle); b.setStyle(defaultStyle); c.setStyle(defaultMarker);
	$( "#payname,#packname" ).val( "Choose a Region/Village" );
	$( "#distname" ).val( "Choose a Village" );
	$( "#var1" ).selectmenu("refresh");  // not working as expected
	$("#payscroll,#packscroll").css("display", "none");
	$( ".distance" ).empty();
	Lines.clearLayers();
	if (breaks == ""){}else{map.removeControl(x);map.removeControl(y);map.removeControl(z);}
	resetSwitch = false;
});

//select menu handlers for layer display
$(function() {
	$( "#var1" ).selectmenu({
		change: function( event, ui ) {
			dispValue = $( "#var1" ).val(); //change display variable
			legName = $("#var1 option[value='" + dispValue + "']").text();
			layerHandler();
		}
	}).selectmenu( "menuWidget" );
	
	/* 			if (dispValue == "Goal"){$('input[type="checkbox"]').prop("disabled",false);}
			else{
				$("input[type='checkbox']").prop("disabled",true);
				$("input[type='checkbox']").prop('checked', false);
			} */
/* 	$("input[type='checkbox']").change(function () {
		layerHandler();
	}); */
});

var x, y, z;
//layer handler for zoom change - add/remove layers
function layerHandler() {
	if (breaks == ""){}else{map.removeControl(x);map.removeControl(y);map.removeControl(z);}
	if (dispValue == "none"){
		a.setStyle(defaultStyle); b.setStyle(defaultStyle); c.setStyle(defaultMarker);
	}
	//LAYER ONADD? call addControl
	else{
		layerName = "Zone";
		breaks = eval("Z" + dispValue);
		a.setStyle(style1);
		x = new Legend();
		map.addControl(x);
		layerName = "Agent";
		breaks = eval("A" + dispValue);
		b.setStyle(style1);
		y = new Legend();
		map.addControl(y);
		layerName = "Village";
		breaks = eval("V" + dispValue);
		c.setStyle(style1);
		z = new Legend();
		map.addControl(z);
	}

/* 	if ($('.showper').is(':checked')){
		overlays.Villages = f;
	}
	else{
		//do nothing
	} */
}
}