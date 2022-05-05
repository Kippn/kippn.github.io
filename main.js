// variables
let title = "";
let	active = d3.select(null);

// searchbar variables
const searchWrapper = document.querySelector(".container-2");
const inputBox = document.getElementById('searchbar');
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = document.querySelector(".icon");

// data arrays
let countries = [];
let dataYear = [];
let dataPointsCO2 = [];
let dataPointsEnergyMix = [];
let dataPointsCO2perPerson = [];
let dataPointsEnergy = [];
// json file
let jsonPath = "/owid-co2-data.json";
// windows size
let l = -window.innerWidth*0.11.toFixed(2);
let r = -window.innerHeight*0.03.toFixed(2);
let w = window.innerWidth*0.8.toFixed(2);
let h = window.innerHeight*0.9.toFixed(2);
let hString = '70%';
let wString = '70%';
let svg;
// set viewbox of the map
let viewBox = l + ' ' + r + ' ' + w + ' ' + h;
document.querySelector('#svg_1').setAttribute('viewBox', viewBox);

if(h>w) {
	t = h;
	h = w;
	w = t;
	hString = '30%';
	wString = '60%';
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

	var node = document.querySelector('[title=' + title +']');
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
 * get unique array
 * @param {*} value 
 * @param {*} index 
 * @param {*} self 
 * @returns 
 */
function getUnique(value, index, self) {
  return self.indexOf(value) === index;
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
$(".container-2").mouseleave(function(e) {
	searchWrapper.classList.remove("active");
})

/**
 * show suggestion list if not empty on hover
 */
$(".container-2").mouseenter(function(e) {
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
	let x1 = myPathBox.width;
	let y1 = myPathBox.height;

	const d = d3.dispatch("start");

	svg = d3.select("svg");
  let path = svg.select('#'+id),
  width = +svg.attr("width"),
  height = +svg.attr("height");
	svg.on("start",stopped,true);

	path.attr("class","feature");
	path.dispatch("start",clicked);
	d.call("start");
	//svg.call(svg,zoom);

	function clicked() {
		if (active.node() === this) return reset(svg,zoom);
		active.classed("active", false);
		active = d3.select(this).classed("active", true);
		let dx = x1,
      	dy = y1,
      	x = (x0 + x1+x0) / 2,
      	y = (y0 + y1+y0) / 2,
      	scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      	translate = [width / 2 - scale * x, height / 2 - scale * y];

		svg.transition()
		.duration(750)
		.call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
		getData(title);

	}
}

$("path").mousedown(function() {
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

/**
 * get data per country name for charts
 * @param {*} title 
 */
 function getData(title) {
	readCSV('/energy-consumption-by-source-and-region.csv',title,()=>{
	readTextFile(jsonPath, function(text){
		var data = JSON.parse(text);
		for(let i = 0; i <data[title].data.length;i++) {
			let year = (data[title].data[i].year);
			let co2 = data[title].data[i].co2;
			let co2PerPerson = data[title].data[i].co2_per_capita;
			let energy = data[title].data[i].primary_energy_consumption;
			if(co2!=null) {
				dataPointsCO2.push({x: year, y: co2});
			}
		
			if(co2PerPerson!=null) {
				dataPointsCO2perPerson.push({x: year, y: co2PerPerson});
			}
			
			if(energy!=null) {
				dataPointsEnergy.push({x: year, y: energy});
			}
		}
		dataPointsCO2.sort((a,b) => b.x - a.x);
		dataPointsCO2perPerson.sort((a,b) => b.x - a.x);
		dataPointsEnergy.sort((a,b) => b.x - a.x);
		chart();
		chart();
		document.getElementById("dialogBox").removeAttribute("hidden");
	});
});
dataPointsCO2 = [];
dataPointsCO2perPerson = [];
dataPointsEnergy = [];
dataPointsEnergyMix = [];
}

/**
 * initilize charts and tabs
 */
function chart () {
	var options1 = {
		backgroundColor: "rgb(186, 186, 186)",
		markerColor: "rgba(56, 56, 56, 0.964)",
		lineThickness: 10,
		zoomEnabled: true,
		animationEnabled: true,
		title: {
			text: title + " CO\u{2082} per year",
		},
		toolTip:{
			fontColor: "rgba(56, 56, 56, 0.964)",
			content:"{x}, CO\u{2082}: {y} t"
		},
		axisY: {
			title: "CO\u{2082} Emission mil tons ",
			suffix: "t"
		},
		axisX: {
			title: "years",
			valueFormatString: "####"

		},
		data: [{
			type: "line",
			color: "rgba(56, 56, 56, 0.964)",
			lineColor: "rgb(4, 86, 4)",
			xValueFormatString: "Year ####",
			dataPoints: dataPointsCO2
		}]
	};

	var options2 = {
		backgroundColor: "rgb(186, 186, 186)",
		markerColor: "rgba(56, 56, 56, 0.964)",
		lineThickness: 10,
		zoomEnabled: true,
		animationEnabled: true,
		yValueFormatString: "####",
		title: {
			text: title + " CO\u{2082} tonnes per person",
		},
		toolTip:{
			fontColor: "rgba(56, 56, 56, 0.964)",
			content:"{x}, CO\u{2082}: {y} t"
		},
		axisY: {
			title: "CO\u{2082} in mil tons per person ",
			suffix: "t"
		},
		axisX: {
			title: "years",
			valueFormatString: "####"
		},
		data: [{
			type: "line",
			xValueFormatString: "Year ####",
			color: "rgba(56, 56, 56, 0.964)",
			lineColor: "rgb(4, 86, 4)",
			dataPoints: dataPointsCO2perPerson
		}]
	};

	var options3 = {
		backgroundColor: "rgb(186, 186, 186)",
		markerColor: "rgba(56, 56, 56, 0.964)",
		lineThickness: 10,
		zoomEnabled: true,
		animationEnabled: true,
		yValueFormatString: "####",
		title: {
			text: title + " Energy consumption in terrawatt-hours",
		},
		toolTip:{
			fontColor: "rgba(56, 56, 56, 0.964)",
			content:"{x}, tWh: {y} t"
		},
		axisY: {
			title: "terrawatt hours per year ",
			suffix: ""
		},
		axisX: {
			title: "years",
			valueFormatString: "####"
		},
		data: [{
			type: "line",
			xValueFormatString: "Year ####",
			color: "rgba(56, 56, 56, 0.964)",
			lineColor: "rgb(4, 86, 4)",
			dataPoints: dataPointsEnergy
		}]
	};

	var options4 = {
		backgroundColor: "rgb(186, 186, 186)",
		//markerColor: "rgba(56, 56, 56, 0.964)",
		lineThickness: 10,
		zoomEnabled: true,
		animationEnabled: true,
		title: {
			text: title + " Energy Mix"
		},
		legend:{
			cursor: "pointer",
			itemclick: explodePie
		},
		data: [{
			type: "pie",
			showInLegend: true,
			radius: 200,
			toolTipContent: "{name}: <strong>{y} tWh</strong>",
			indexLabel: "{name} - {y} tWh",
			//color: "rgba(56, 56, 56, 0.964)",
			//lineColor: "rgb(4, 86, 4)",
			//xValueFormatString: "Year ####",
			dataPoints: dataPointsEnergyMix,
		}]
	};
		
		$("#dialogBox").dialog({
			open: function(event,ui) {
				$(document).on('click',".ui-widget-overlay",function(e){
          //call dialog close function
					reset(svg,zoom);
       });
				$("#tabs").tabs({
					create: function (event, ui) {
						//Render Charts after tabs have been created.
					},
					activate: function (event, ui) {
						//Updates the chart to its container size if it has changed.
						ui.newPanel.children().first().CanvasJSChart().render();
					}
				});
				$('.ui-widget-overlay').bind('click', function () {
					$("#dialogBox").dialog('close');
			});
			},
			close: function() {
        // Remove click handler for the current .ui-widget-overlay
        $(document).off("click",".ui-widget-overlay");
				reset(svg,zoom);
        // Invoke parent close method
    },
			hide: { effect: 'drop', duration: 250 },
			show: { effect: 'fade', duration: 500 },
			closeOnEscape: true,
			draggable: false,
			resizable: false,
			title: title + ' statistics',
			width: wString,
			hight: hString,
			modal: true,
			closeText: '',
			show: 500
		});
		$("#chartContainer1").CanvasJSChart(options1);
		$("#chartContainer2").CanvasJSChart(options2);
		$("#chartContainer3").CanvasJSChart(options3);
		$("#chartContainer4").CanvasJSChart(options4);
	}

	function explodePie (e) {
		if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
			e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
		} else {
			e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
		}
		e.chart.render();
	}

	