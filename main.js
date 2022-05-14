// variables
let title = "";
var title2 = "";
let	active = d3.select(null);
let compare = 0;
var options1 = {
	backgroundColor: "rgba(186, 186, 186, 0.1)",
	markerColor: "rgba(56, 56, 56, 0.964)",
	zoomEnabled: true,
	animationEnabled: true,
	toolTip:{
		shared: true
	},
	axisY: {
		title: "CO\u{2082} mil tons ",
		suffix: "t",
		minimum: 0,
		//titleFontSize: 30
	},
	axisX: {
		title: "years",
		valueFormatString: "####",
		//titleFontSize: 30
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: true,
	}
};
var options2 = {
	backgroundColor: "rgba(186, 186, 186, 0.1)",
	markerColor: "rgba(56, 56, 56, 0.964)",
	zoomEnabled: true,
	animationEnabled: true,
	yValueFormatString: "####",
	toolTip:{
		shared: true
	},
	axisY: {
		title: "CO\u{2082} mil tons p.P",
		suffix: "t",
		minimum: 0,
		//titleFontSize: 24
	},
	axisX: {
		title: "years",
		valueFormatString: "####",
		//titleFontSize: 30
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: true,
	}
};
var options3 = {
	backgroundColor: "rgba(186, 186, 186, 0.1)",
	markerColor:"rgba(56, 56, 56, 0.964)",
	zoomEnabled: true,
	animationEnabled: true,
	yValueFormatString: "####",
	toolTip:{
		shared: true
	},
	axisY: {
		title: "tWh per year",
		suffix: "",
		minimum: 0,
		//titleFontSize: 30
	},
	axisX: {
		title: "years",
		valueFormatString: "####",
		//titleFontSize: 30
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: true,
	}
};
var options4 = {
	backgroundColor: "rgba(186, 186, 186, 0.1)",
	markerColor:"rgba(56, 56, 56, 0.964)",
	zoomEnabled: true,
	animationEnabled: true,
	yValueFormatString: "####",
	toolTip:{
		shared: true
	},
	axisY: {
		title: "methane per year",
		suffix: "",
		minimum: 0,
		//titleFontSize: 30
	},
	axisX: {
		title: "years",
		valueFormatString: "####",
		//titleFontSize: 30
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: true,
	}
};
// searchbar variables
const searchWrapper = document.querySelector(".container");
const inputBox = document.getElementById('searchbar');
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = document.querySelector(".icon");

// data arrays
let countries = [];
let dataYear = [];
var dataOption1 = [];
var dataOption2 = [];
var dataOption3 = [];
var dataOption4 = [];
let dataPointsCO2 = [];
let dataPointsEnergyMix = [];
let dataPointsCO2perPerson = [];
let dataPointsEnergy = [];
let dataPointsMethane = [];
// json file
let jsonPath = "owid-co2-data.json";
let csvPath = 'energy-consumption-by-source-and-region.csv';
// windows size
let l = -window.innerWidth*0.11.toFixed(2);
let r = -window.innerHeight*0.03.toFixed(2);
let w = window.innerWidth.toFixed(2);
let h = window.innerHeight.toFixed(2);
let hString = '100%';
let wString = '80%';
let svg;
if(h>w) {
	t = h;
	h = w;
	w = t;
}


var controller = new ScrollMagic.Controller();

new ScrollMagic.Scene({
	triggerElement: "#trigger1",
	triggerHook: 0.9, // show, when scrolled 10% into view
	//duration: '150%', // hide 10% before exiting view (80% + 10% from bottom)
	offset: 50 // move trigger to center of element
})
.setClassToggle("#reveal", "visible") // add class to reveal
.addTo(controller);

function scroll() {
	document.getElementById("reveal").scrollIntoView({behavior: 'smooth', block:'end'});
	setTimeout(function() {
		window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" })},2000);
}


$(".scroll-down").click(function() {
	scroll();
});

$('#mapNav').click(function() {
	scroll();
})


$("button").click(function() {
	compare = 1;
	title2 = title;
	$("#dialogBox").dialog('close');
	reset(svg,zoom);
});

function findPos(obj) {
	var curtop = 0;
	if (obj.offsetParent) {
			do {
					curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
	return [curtop];
	}
}
/**
 * search function with prediction
 */
function search() {
	let input = document.getElementById('searchbar').value
	if(input) {
		input=input.toLowerCase();	
	readTextFile(jsonPath, function(text){
		var x = JSON.parse(text);
		for (let key in x) {
			countries.push(key);
		}
		temp = countries.filter(element => element.toLowerCase().startsWith(input));
		temp = temp.map((data) => {
			return data = `<li>${data}</li>`;
		});

		searchWrapper.classList.add("active"); //show autocomplete box
		showSuggestions(temp);
		let allList = suggBox.querySelectorAll("li");

		for (let i = 0; i < allList.length; i++) {
				//adding onclick attribute in all li tag
				allList[i].setAttribute("onclick", "select(this)");
		}
	})
	} else {
		searchWrapper.classList.remove("active");
	}
}
/**
 * 
 * @param {*} element 
 * select an item from predictions
 */
function select(element){
	let selectData = element.textContent;
	title = selectData;

	var node = document.querySelector(`[title=${CSS.escape(title)}]`);
	zoomToClick(node);

	inputBox.value = selectData;
	icon.onclick = ()=>{
	}
	searchWrapper.classList.remove("active");
}
/**
 * 
 * @param {*} list 
 * list of suggestions
 */
function showSuggestions(list){
	list = [...new Set(list)];
	let listData;
	if(!list.length){
			userValue = inputBox.value;
			listData = `<li>${userValue}</li>`;
	}else{
		listData = list.join('');
	}
	suggBox.innerHTML = listData;
}

/**
 * tipTool when hover over country
 */
$("path").mouseenter(function(e) {
  $(".hovertext").text($(this).attr('title'));
  $(".hovertext").css({
		//'opacity': 1.0,
    'top': e.pageY - 20,
    'left': e.pageX
  }).fadeIn('fast');
});

/**
 * hide tipTool when leave
 */
$("path").mouseleave(function(e) {
  $(".hovertext").hide();
  $(".hovertext").css({
  })
});

/**
 * hide suggestion list when leave
 */
$(".container").mouseleave(function(e) {
	searchWrapper.classList.remove("active");
})

/**
 * show suggestion list if not empty on hover
 */
$(".container").mouseenter(function(e) {
	if(e.target.value != null && e.target.value != "") {
		searchWrapper.classList.add("active");
	}
})

/**
 * get country name if clicked on
 */
 function reset(svg,zoom) {
	active.classed("active", false);
	active = d3.select(null);
	svg.transition().duration(750).call(zoom.transform,
		d3.zoomIdentity);
}

function zoomed() {
	var g = d3.select("g");
	g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
	g.attr("transform", d3.event.transform);
}

function stopped() {
	if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

const zoom = d3.zoom()
.scaleExtent([1, 8])
.on("zoom", zoomed);

function zoomToClick(i) {
	let id = i.id;
  title = $(i).attr('title');
	var myPathBox = $("#"+id)[0].getBBox();
	let x0 = myPathBox.x;
	let y0 = myPathBox.y;
	let x1 = (x0 + myPathBox.width)*1.11;
	let y1 = y0 + myPathBox.height;

	const d = d3.dispatch("show");

	svg = d3.select("svg");
  let path = svg.select('#'+id),
	//width = window.innerWidth,
	//height = window.innerHeight;
	width = document.querySelector("#svg_1").clientWidth,
  height = document.querySelector("#svg_1").clientHeight;
	svg.on("start",stopped,true);

	path.attr("class","feature");
	path.dispatch("show",clicked);
	d.call("show");
	//svg.call(svg,zoom);

	function clicked() {
		if (active.node() === this) return reset(svg,zoom);
		active.classed("active", false);
		active = d3.select(this).classed("active", true);
		let dx = x1 - x0,
      	dy = y1 - y0,
      	x = ((x0 + x1) / 2),
      	y = (y0 + y1) / 2,
      	scale = Math.max(1, Math.min(8, 0.8 / Math.max(dx / width, dy / height))),
      	translate = [width / 2 - scale * x, height / 2 - scale * y];
		svg.transition()
		.duration(750)
		.call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale));
		getData(title);
	}
}

$("path").on('click',function() {
	zoomToClick(this);
});

/**
 * get data from json file
 * @param {*} file 
 * @param {*} callback 
 */
function readTextFile(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function() {
			if (rawFile.readyState === 4 && rawFile.status == "200") {
					callback(rawFile.responseText);
			}
	}
	rawFile.send(null);
}

function readCSV(file, title, _callback) {
	d3.csv(file, function(data) {
		for(i = 0; i < data.length; i+=56) {
			if(data[i].Entity === title) {
				i+= 55;
				dataPointsEnergyMix.push({y: Number(data[i].BiofuelsConsumption).toFixed(2), name: 'Biofuels Consumption'});
				dataPointsEnergyMix.push({y: Number(data[i].SolarConsumption).toFixed(2), name: 'Solar Consumption'});
				dataPointsEnergyMix.push({y: Number(data[i].WindConsumption).toFixed(2), name: 'Wind Consumption'});
				dataPointsEnergyMix.push({y: Number(data[i].HydroConsumption).toFixed(2), name: 'Hydro Consumption'});
				dataPointsEnergyMix.push({y: Number(data[i].NuclearConsumption).toFixed(2), name: 'Nuclear Consumption'});
				dataPointsEnergyMix.push({y: Number(data[i].GasConsumption).toFixed(2), name: 'Gas Consumption'});
				dataPointsEnergyMix.push({y: Number(data[i].CoalConsumption).toFixed(2), name: 'Coal Consumption'});
				dataPointsEnergyMix.push({y: Number(data[i].OilConsumption).toFixed(2), name: 'Oil Consumption'});
				dataPointsEnergyMix.push({y: Number(data[i].GeoBiomass).toFixed(2), name: 'Geo Biomass'});
				_callback();
				break;
			}
		}
		_callback();
});
}

function getUniqueListBy(arr, key) {
	return [...new Map(arr.map(item => [item[key], item])).values()]
}

/**
 * get data per country name for charts
 * @param {*} title 
 */
 function getData(title) {
	readCSV(csvPath,title,()=>{
	readTextFile(jsonPath, function(text){
		var data = JSON.parse(text);
		for(let i = 0; i <data[title].data.length;i++) {
			let year = (data[title].data[i].year);
			let co2 = data[title].data[i].co2;
			let co2PerPerson = data[title].data[i].co2_per_capita;
			let energy = data[title].data[i].primary_energy_consumption;
			let methane = data[title].data[i].methane;
		
			if(co2!=null) {
				dataPointsCO2.push({x: year, y: co2});
			}
		
			if(co2PerPerson!=null) {
				dataPointsCO2perPerson.push({x: year, y: co2PerPerson});
			}
			
			if(energy!=null) {
				dataPointsEnergy.push({x: year, y: energy});
			}

			if(methane!=null) {
				dataPointsMethane.push({x: year, y:methane});
			}
		}
		dataPointsCO2.sort((a,b) => b.x - a.x);
		dataPointsCO2perPerson.sort((a,b) => b.x - a.x);
		dataPointsEnergy.sort((a,b) => b.x - a.x);
		dataPointsMethane.sort((a,b) => b.x - a.x);


		dataOption1.push({
			type:'line',
			color: "rgb(4, 86, 4)",
			name: title,
			showInLegend: true,
			lineColor: "rgb(4, 86, 4)",
			lineThickness: 5,
			xValueFormatString: "Year: ####", 
			yValueFormatString: "######.## t", 
			dataPoints: dataPointsCO2});

		dataOption2.push({
			name: title,
			type: "line",
			showInLegend: true,
			xValueFormatString:"Year: ####",
			yValueFormatString:"#######.## t",
			color: "rgb(4, 86, 4)",
			lineColor: "rgb(4, 86, 4)",
			lineThickness: 5,
			dataPoints: dataPointsCO2perPerson
		});

		dataOption3.push({
			name: title,
			showInLegend: true,
			xValueFormatString:"Year: ####",
			yValueFormatString:"#######.## tWh",
			type: "line",
			color: "rgb(4, 86, 4)",
			lineColor: "rgb(4, 86, 4)",
			lineThickness: 5,
			dataPoints: dataPointsEnergy
		});

		dataOption4.push({
			name: title,
			showInLegend: true,
			xValueFormatString:"Year: ####",
			yValueFormatString:"#######.## t",
			type: "line",
			color: "rgb(4, 86, 4)",
			lineColor: "rgb(4, 86, 4)",
			lineThickness: 5,
			dataPoints: dataPointsMethane
		});

		if(compare==0) {
		options1['title'] = 	{
			text: title + " CO\u{2082} per year",
			//fontSize: 40
		};
		options2['title'] = 	{
			text: title + " CO\u{2082} tons per person",
			//fontSize: 40
		};
		options3['title'] = 	{
			text: title + " Energy consumption in terrawatt-hours",
			//fontSize: 40
		};
		options4['title'] = 	{
			text: title + " Methan in mil tons of carbon dioxide-equivalents",
			//fontSize: 40
		};
	} else {
		options1['title'] = 	{
			text: title + " vs. " + title2 + " CO\u{2082} per year",
			//fontSize: 40
		};
		options2['title'] = 	{
			text: title + " vs. " + title2  + " CO\u{2082} tons per person",
			//fontSize: 40
		};
		options3['title'] = 	{
			text: title + " vs. " + title2  + " Energy consumption in terrawatt-hours",
			//fontSize: 40
		};
		options4['title'] = 	{
			text: title + " vs. " + title2 + " Methan in mil tons of carbon dioxide-equivalents",
			//fontSize: 40
		};
	}

		options1['data'] = removeDuplicateObjectFromArray(dataOption1,'name');
		options2['data'] = removeDuplicateObjectFromArray(dataOption2,'name');
		options3['data'] = removeDuplicateObjectFromArray(dataOption3,'name');
		options4['data'] = removeDuplicateObjectFromArray(dataOption4,'name');

		if(compare==1) {
			let options = [options1,options2,options3,options4];
			options.forEach(element => {
				element.data.forEach(data => {
					delete data.color;
					delete data.lineColor;
				})
			});
		}
		
		chart();
		document.getElementById("dialogBox").removeAttribute("hidden");
	});
});
}

function removeDuplicateObjectFromArray(array, key) {
  var check = new Set();
  return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
}
/**
 * initilize charts and tabs
 */
 function chart () {

	var options5 = {
		backgroundColor: "rgba(186, 186, 186, 0.1)",
		zoomEnabled: true,
		animationEnabled: true,
		title: {
			text: title + " Energy Mix",
			fontSize: 40
		},
		legend:{
			cursor: "pointer",
			itemclick: explodePie,
			fontSize: 15
		},
		data: [{
			type: "pie",
			showInLegend: true,
			radius: 200,
			indexLabelFontSize: 20,	

			toolTipContent: "{name}: <strong>{y} tWh</strong>",
			indexLabel: "{name} - {y} tWh",
			dataPoints: dataPointsEnergyMix,
		}]
	};
		$("#dialogBox").dialog({
			open: function(event,ui) {
				$(document).on('click',".ui-widget-overlay",function(e){
          //call dialog close function
       }),
				$("#tabs").tabs({
					beforeLoad: function(event,ui) {
					},
					create: function (event, ui) {
						event.preventDefault();
						//Render Charts after tabs have been created.
					},
					activate: function (event, ui) {
						//Updates the chart to its container size if it has changed.
						ui.newPanel.children().first().CanvasJSChart().render();
					}
				});
				$('.ui-widget-overlay').bind('click', function () {
					$("#dialogBox").dialog('close');
					compare = 0;
					dataOption1 = [];
					dataOption2 = [];
					dataOption3 = [];
					dataOption4 = [];
			});
			},
			close: function() {
        // Remove click handler for the current .ui-widget-overlay
        $(document).off("click",".ui-widget-overlay");
				reset(svg,zoom);
				dataPointsCO2 = [];
				dataPointsCO2perPerson = [];
				dataPointsEnergy = [];
				dataPointsEnergyMix = [];
				dataPointsMethane = [];
        // Invoke parent close method
    },
			hide: { effect: 'drop', duration: 250 },
			show: { effect: 'fade', duration: 500 },
			closeOnEscape: true,
			draggable: false,
			resizable: false,
			width: '90%',
			hight: '100%',
			modal: true,
			show: 500,
		}).dialog('widget').find(".ui-dialog-title").hide();
		$("#chartContainer1").CanvasJSChart(options1);
		$("#chartContainer2").CanvasJSChart(options2);
		$("#chartContainer3").CanvasJSChart(options3);
		$("#chartContainer4").CanvasJSChart(options4);
		$("#chartContainer5").CanvasJSChart(options5);
};
function explodePie (e) {
		if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
			e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
		} else {
			e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
		}
		e.chart.render();
}

	
