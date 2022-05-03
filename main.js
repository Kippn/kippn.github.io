// variables
let countries = [];
let dataYear = [];
let dataPointsCO2 = [];
let title = "";
// searchbar variables
const searchWrapper = document.querySelector(".container-2");
const inputBox = document.getElementById('searchbar');
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = document.querySelector(".icon");

// data arrays
let dataPointsCO2perPerson = [];
let dataPointsEnergy = [];
// json file
let jsonPath = "../data/owid-co2-data.json";
// windows size
let l = -window.innerWidth*0.11;
let r = -window.innerHeight*0.03;
let w = window.innerWidth*0.95;
let h = window.innerHeight*0.95;
// set viewbox of the map
let viewBox = l + ' ' + r + ' ' + w + ' ' + h;
document.querySelector('#svg_1').setAttribute('viewBox', viewBox);

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
	getData(title);

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
			userValue = inputBox.value();
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
		console.log(e.target.value);
		searchWrapper.classList.add("active");
	}
})

/**
 * get country name if clicked on
 */
$("path").mousedown(function() {
  title = $(this).attr('title');
	getData(title);
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

/**
 * get data per country name for charts
 * @param {*} title 
 */
 function getData(title) {
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
		dataPointsCO2 = [];
		dataPointsCO2perPerson = [];
		dataPointsEnergy = [];
		document.getElementById("dialogBox").removeAttribute("hidden");
	});
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
		
		$("#dialogBox").dialog({
			open: function(event,ui) {
				var me = this;
				$(document).on('click',".ui-widget-overlay",function(e){
          //call dialog close function
          //me.close();
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
        // Invoke parent close method
    },
			hide: { effect: 'drop', duration: 250 },
			show: { effect: 'fade', duration: 500 },
			closeOnEscape: true,
			draggable: false,
			resizable: false,
			title: title + ' statistics',
			width: 1000,
			hight: h,
			modal: true,
			closeText: '',
			show: 500
		});
		$("#chartContainer1").CanvasJSChart(options1);
		$("#chartContainer2").CanvasJSChart(options2);
		$("#chartContainer3").CanvasJSChart(options3);
	}

	