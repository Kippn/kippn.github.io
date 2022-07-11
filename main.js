// ************ variables ************** //
let titleCountry = "";
var titleCountry2 = "";
let	active = d3.select(null);
let compare = 0;
let hString = '100%';
let wString = '80%';
var language =  document.querySelector('#checkLanguage').checked;
var checkScroll =  document.querySelector('#checkScroll').checked;
let foodChart = false;
let foodChartTitle;
// diagram objects
var options1 = {
	backgroundColor: "rgba(186, 186, 186, 0.1)",
	markerColor: "rgba(56, 56, 56, 0.964)",
	zoomEnabled: false,
	animationEnabled: true,
	colorSet: "greenShades",
	toolTip:{
		fontColor: "rgb(4,86,4)",
		shared: true
	},
	axisY: {
		title: "CO\u{2082} mil tons ",
		suffix: "t",
		minimum: 0,
		titleFontSize: 30,
		titleFontColor: 'rgb(186, 186, 186)',
		labelFontSize: 20,
		labelFontColor: 'rgb(186, 186, 186)'
	},
	axisX: {
		title: "years",
		valueFormatString: "####",
		titleFontSize: 30,
		titleFontColor: 'rgb(186, 186, 186)',
		labelFontSize: 20,
		labelFontColor: 'rgb(186, 186, 186)'
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: true,
		fontColor: "rgb(186, 186, 186)",
		fontSize: 20,
	}
};
var options2 = {
	backgroundColor: "rgba(186, 186, 186, 0.1)",
	markerColor: "rgba(56, 56, 56, 0.964)",
	colorSet: "greenShades",
	zoomEnabled: false,
	animationEnabled: true,
	yValueFormatString: "####",
	toolTip:{
		shared: true
	},
	axisY: {
		title: "CO\u{2082} mil tons p.P",
		suffix: "t",
		minimum: 0,
		titleFontSize: 30,
		titleFontColor: 'rgb(186, 186, 186)',
		labelFontSize: 20,
		labelFontColor: 'rgb(186, 186, 186)'
	},
	axisX: {
		title: "years",
		valueFormatString: "####",
		titleFontSize: 30,
		titleFontColor: 'rgb(186, 186, 186)',
		labelFontSize: 20,
		labelFontColor: 'rgb(186, 186, 186)'
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: true,
		fontColor: "rgb(186, 186, 186)",
		fontSize: 20,
	}
};
var options3 = {
	backgroundColor: "rgba(186, 186, 186, 0.1)",
	markerColor:"rgba(56, 56, 56, 0.964)",
	colorSet: "greenShades",
	zoomEnabled: false,
	animationEnabled: true,
	yValueFormatString: "####",
	toolTip:{
		shared: true
	},
	axisY: {
		title: "tWh per year",
		suffix: "",
		minimum: 0,
		titleFontSize: 30,
		titleFontColor: 'rgb(186, 186, 186)',
		labelFontSize: 20,
		labelFontColor: 'rgb(186, 186, 186)'
	},
	axisX: {
		title: "years",
		valueFormatString: "####",
		titleFontSize: 30,
		titleFontColor: 'rgb(186, 186, 186)',
		labelFontSize: 20,
		labelFontColor: 'rgb(186, 186, 186)'
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: true,
		fontColor: "rgb(186, 186, 186)",
		fontSize: 20,
	}
};
var options4 = {
	backgroundColor: "rgba(186, 186, 186, 0.1)",
	markerColor:"rgba(56, 56, 56, 0.964)",
	colorSet: "greenShades",
	zoomEnabled: false,
	animationEnabled: true,
	yValueFormatString: "####",
	toolTip:{
		shared: true
	},
	axisY: {
		title: "methane per year",
		suffix: "",
		minimum: 0,
		titleFontSize: 30,
		titleFontColor: 'rgb(186, 186, 186)',
		labelFontSize: 20,
		labelFontColor: 'rgb(186, 186, 186)'
	},
	axisX: {
		title: "years",
		valueFormatString: "####",
		titleFontSize: 30,
		titleFontColor: 'rgb(186, 186, 186)',
		labelFontSize: 20,
		labelFontColor: 'rgb(186, 186, 186)'
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: true,
		fontColor: "rgb(186, 186, 186)",
		fontSize: 20,
	}
};
// searchbar variables
const searchWrapper = document.querySelector(".containerSearch");
const inputBox = document.getElementById('searchbar');
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = document.querySelector(".icon");
let allList = [];
var currentLI = 0;
let countryList = [];

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
// file paths
let jsonPath = 'owid-co2-data.json';
let csvPath = 'energy-consumption-by-source-and-region.csv';
const svg = d3.select('#svg_1');
let w = document.querySelector("#svg_1").clientWidth;
let h = document.querySelector("#svg_1").clientHeight;
let size = 0.61;
let dialogWidth = 0.8;
let foodChartFontTitle = 30;
let foodChartFontData = 20;
let lineHeight = ($(document).height() - $(window).height())*0.68;
let lineWidth = $(document).width()*0.68;





// ************ mobile *************** //
var documentClick;
const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

if(isMobile) {
	wString = '100%';
	//w *= 2;
	size = 0.71;
	dialogWidth = 0.99;
	foodChartFontData = 10;
	foodChartFontTitle = 15;
	checkScroll = true;
	document.querySelector('#checkScroll').checked = true;
}





//************ on load functions ************** //

// load country names from map
$(document).ready(function() {
	changeLanguage(language);
	changeScroll(checkScroll);
	drawLine();
	let t = document.getElementById('svg_1').getElementsByTagName('path');
	for(let i = 0; i < t.length; i++) {
		countryList.push($(t[i]).attr('title'));
	}
});







// ************ Buttons ************ //

/**
 * language change button
 */
$('#checkLanguage').on('click', function() {
	language = document.querySelector('#checkLanguage').checked;
	changeLanguage(language);
});

$('#checkScroll').on('click', function() {
	checkScroll = document.querySelector('#checkScroll').checked;
	changeScroll(checkScroll);
});

/**
 * change the language
 * @param {c} language 
 */
 function changeLanguage(language) {
	if(language) {
		foodChartTitle ='Treibhausgasemissionen';
		$('.de').css({
			color: 'rgb(4, 86, 4)'
		})
		$('.en').css({
			color: 'rgb(186, 186, 186)'
		})
		$('.contentGerman').css({
			display: 'block'
		})
		$('.contentEnglish').css({
			display: 'none'
		})
	} else {
		foodChartTitle ='Greenhouse Gas Emissions';
		$('.en').css({
			color: 'rgb(4, 86, 4)'
		})
		$('.de').css({
			color: 'rgb(186, 186, 186)'
		})
		$('.contentEnglish').css({
			display: 'block'
		})
		$('.contentGerman').css({
			display: 'none'
		})
}
}

function changeScroll(scroll) {
	if(scroll) {
		$('.normalScroll').css({
			color: 'rgb(4, 86, 4)'
		})
		$('.snapScroll').css({
			color: 'rgb(186, 186, 186)'
		})
	} else {
		$('.snapScroll').css({
			color: 'rgb(4, 86, 4)'
		})
		$('.normalScroll').css({
			color: 'rgb(186, 186, 186)'
		})
}
}

// scroll down button
$(".scroll-down").click(function() {
	scroll();
});

// navigation map button
$('#mapNav').click(function() {
	scroll();
});

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
  var dropdown = document.querySelector(".dropdown-content");
    if (dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
};

// compare button
$(".buttonCompare").click(function() {
	compare = 1;
	titleCountry2 = titleCountry;
	$("#dialogBox").dialog('close');
	reset(svg,zoom);
});

// scroll to top
function topFunction() {
	window.scrollTo({top: 0, behavior: 'smooth'});
}

function changeWelcomeText(e=null, clicked = false) {
	let dots = document.querySelectorAll('.dot');
	let texts = document.querySelectorAll('.welcomeText');
	let index = 0;
	for(let i = 0; i < dots.length; i++) {
		if(dots[i].classList.contains('active')) {
			dots[i].classList.remove('active');
			$(texts[i]).css('display','none');
			index = i;
			break;
		}
		if(i == dots.length-1) {
			$(texts[0]).css('display','flex');
			dots[0].classList.add('active');
		}
	}
	if(!clicked) {
		if(index == dots.length-1) {
			index = 0;
		} else {
			index += 1;
		}
		dots[index].classList.add('active');
		if(index==1 && language && isMobile) {
			$(texts[index]).css({
				fontSize: '1vh',
				display: 'flex'
			});
		} else {
			$(texts[index]).css('display','flex');
		}
	}
	if(clicked && e != null){
		e.target.classList.add('active');
		number = Number(e.target.classList[1].replace(/\D+/g, ""));
		$(texts[number]).css('display','flex');
		if(number == 1 && language && isMobile) {
			console.log('test');
			$(texts[number]).css('font-size','1vh');
		}
	} 
}


let timeTextChange =	setInterval(changeWelcomeText,15000); 


setTimeout(timeTextChange,15000);


$('.dot').click(function(e) {
	changeWelcomeText(e, true);
	clearInterval(timeTextChange);
	timeTextChange =	setInterval(changeWelcomeText,15000); 
});








// *********** Event Listener ***************** //


/**
 * change map size if window resized
 */
 window.addEventListener('resize', function() {
	w = document.querySelector("#svg_1").clientWidth;
	h = document.querySelector("#svg_1").clientHeight;
	lineHeight = $(document).height() - $(window).height();
	lineWidth = $(document).width();
})












// ************* Countdown Functions ***********//
/**
 * set offset of countdown
 * @param {percentage} amt 
*/
function setProgress(amt) {
	earthPercentage.innerText = ((amt*100)).toFixed(2) + ' %';
  amt = (amt < 0) ? 0 : (amt > 1) ? 1 : amt;
  document.getElementById("stop1").setAttribute("offset", amt);
  document.getElementById("stop2").setAttribute("offset", amt);
} 

var maxCO2 = 400000000000;
var co2PerSecond = 1337;
var timeStart = new Date(2020, 0, 0, 0, 0, 0, 0);
var first = true;
var p2 = document.querySelectorAll('p2');
var earthPercentage = document.querySelector('p3');

var seconds = 1;
var secondsPerMin = seconds*60;
var secondsPerHour = secondsPerMin*60;
var secondsPerDay = secondsPerHour*24;
var secondsPerMonth = secondsPerDay*30;
var secondsPerYear = secondsPerMonth*12;
var times = [];
var out;
times.push(secondsPerYear);
times.push(secondsPerMonth);
times.push(secondsPerDay);
times.push(secondsPerHour);
times.push(secondsPerMin);
times.push(seconds);

var fillTime =  async() => {while(true) {
	const currTime = new Date();
	var seconds = Math.floor((currTime - timeStart) / 1000);
	out = 1-((maxCO2 - seconds*co2PerSecond)/maxCO2);
	var secondsLeft = Math.round((maxCO2 - seconds*co2PerSecond)/co2PerSecond);

	for(var i = 0; i < p2.length; i++) {
		var temp = 0;
		while(secondsLeft/times[i] >= 1) {
			temp += 1;
			secondsLeft -= times[i];
		}
		tempString = temp.toString();
		if (tempString.length != 2) tempString = '0' + tempString;
		p2[i].innerText = tempString;
	}

	if(!first) {
		setProgress(out);
		await new Promise(resolve => setTimeout(resolve,1000));
	} else {
		await new Promise(resolve => setTimeout(resolve,1000));
	}
}};

var fillImage = async(out) => {while(first) {
		for(let i = 0; i <= out; i+=0.0005) {
			setProgress(i);
			await new Promise(resolve => setTimeout(resolve,i*30));
		}
		first = false;
}};

fillTime();
fillImage(out);













// ************ Scroll Behavior *********** //

// set height of the svg path as constant
const svg_line = document.getElementById("svgPath");
const length = svg_line.getTotalLength()*1.02;

// start positioning of svg drawing
svg_line.style.strokeDasharray = length;

// hide svg before scrolling starts
svg_line.style.strokeDashoffset = length;

//draw line throw window on scroll
window.addEventListener("scroll", function() {
	drawLine();
});

function drawLine() {
	const scrollPercentage = $(window).scrollTop()/($(document).height() - $(window).height()*2);
  const draw = length * scrollPercentage;
  // Reverse the drawing when scroll upwards
  svg_line.style.strokeDashoffset = length - draw;
	if(checkScroll==true && !foodChart && scrollPercentage > 0.5) chartFood();
	if(scrollPercentage < 0.05) foodChart=false;
}

/**
 * snap scroll
 */
var isScrolling = false;
var currSection;
var oldSection;
var scrolled = false;
var timer;

function scrollToElement(element) {
	isScrolling = true;
	if(element.attr('class') == 'food' && !foodChart) chartFood();
	$('html, body').animate({
		scrollTop: $(element).offset().top
	}, 200, function() {
		isScrolling = false;
	});
}

// check if scoll stopped
window.onscroll = function() {
	if(typeof this.scrollY !=='undefined' && typeof this.oldScroll !=='undefined') {
		if(Math.abs(this.oldScroll.toFixed(0) - this.scrollY.toFixed(0)) <= 2 ) {
			scrolled = true;
		}  else {
			scrolled = false;
		}
	}
  this.oldScroll = this.scrollY;
}

// get current section in window
$(document).scroll(function() {
	currSection = $('section').filter(function() {
    var $this = $(this);
    var offset = $this.offset().top;
    var view = $(window).height() / 2;

    return $(window).scrollTop() >= offset - view && offset + ($this.outerHeight() - view) >= $(window).scrollTop();
});
	oldSection = currSection;
});

// scroll to element in sight if scroll stopped
$(document).scroll(function() {
    if(timer) {
        window.clearTimeout(timer);
    }
    timer = window.setTimeout(function() {
			if(scrolled && !isScrolling && !checkScroll) {
				scrolled = false;
				scrollToElement(currSection);
			}
    }, 100);
});











// ********** Scroll Animation ********* //
var controller = new ScrollMagic.Controller();

new ScrollMagic.Scene({
	triggerElement: "#trigger",
	triggerHook: 0.9, // show, when scrolled 10% into view
	//duration: '150%', // hide 10% before exiting view (80% + 10% from bottom)
	offset: 50 // move trigger to center of element
})
.setClassToggle("#reveal", "visible") // add class to reveal
.addTo(controller);

function scroll() {
	document.querySelector("#reveal").scrollIntoView({behavior: 'smooth', block:'end'});
	setTimeout(function() {
		window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" })},2000);
}












// ******* Searchbar ******* //

// delete all item from list2 if not also in list1
function comp(list1, list2) {
	var newList =  [];
	for(let t=0; t < list1.length;t++) {
		for(let k=0; k < list2.length; k++) {
			if(list1[t] == list2[k]) newList.push(list2[k]);
		}
	}
	return newList;
}
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
 $(function() {
	if(isMobile) {
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	$("html, body").css({"width":w,"height":h});
	}
});
function search() {
	let input = document.getElementById('searchbar').value;
	if(input) {
		input=input.toLowerCase();	
		readTextFile(jsonPath, function(text){
			var x = JSON.parse(text);
			for (let key in x) {
				countries.push(key);
			}
			countries = comp(countryList,countries);
			temp = countries.filter(element => element.toLowerCase().startsWith(input));
			temp = temp.map((data) => {
			return data = `<li>${data}</li>`;
			});

			searchWrapper.classList.add("active"); //show autocomplete box
			showSuggestions(temp);
			allList = suggBox.querySelectorAll("li");

			for (let i = 0; i < allList.length; i++) {
				//adding onclick attribute in all li tag
				allList[i].setAttribute("onclick", "select(this)");
			}
			if(allList.length > 0) {
				allList[currentLI].className = 'highlight';
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
	titleCountry = selectData;
	if(titleCountry==null) {
		titleCountry = element;
	}
	var node = document.querySelector(`[title=${CSS.escape(titleCountry)}]`);
	zoomToClick(node);

	inputBox.value = selectData;
	icon.onclick = ()=>{
	}
	searchWrapper.classList.remove("active");
	currentLI = 0;
	allList =  [];
	inputBox.value = "";
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
 * navigation for suggestion box
 */


document.addEventListener('keydown',function(event) {
	switch(event.keyCode){
		case 38: // Up arrow    
			// Remove the highlighting from the previous element
			allList[currentLI].classList.remove("highlight");
			currentLI = currentLI > 0 ? --currentLI : 0;     // Decrease the counter      
			allList[currentLI].className = 'highlight'; // Highlight the new element
			break;
		case 40: // Down arrow
			// Remove the highlighting from the previous element
			allList[currentLI].classList.remove("highlight");
			currentLI = currentLI < allList.length-1 ? ++currentLI : allList.length-1; // Increase counter 
			allList[currentLI].className = 'highlight';       // Highlight the new element
			break;
		case 13: // Enter
			searchWrapper.classList.remove("active");
			allList[currentLI].click();
			//select(allList[currentLI]);
	}
	if(allList.length > 0) allList[currentLI].scrollIntoViewIfNeeded();
});

/**
 * hide suggestion list when leave
 */
 $(".containerSearch").mouseleave(function(e) {
	searchWrapper.classList.remove("active");
})

/**
 * show suggestion list if not empty on hover
 */
$(".containerSearch").mouseenter(function(e) {
	$('.alert').css(
		'visibility', 'hidden'
	);
	if(e.target.value != null && e.target.value != "") {
		searchWrapper.classList.add("active");
	}
})












// ******* Map Functions ******** //

/**
 * tipTool when hover over country if not mobile
 */

$("#svg_1").children('g').children('path').mouseenter(function(e) {
	if(!isMobile) {
	initZoom();
  $(".hovertext").text($(this).attr('title'));
  $(".hovertext").css({
    'top': e.pageY - 20,
    'left': e.pageX
  }).fadeIn('fast');
}
});

/**
 * hide tipTool when leave
 */
 $("#svg_1").children('g').children('path').mouseleave(function() {
	if(!isMobile) {
	stopZoom();
	//$('.hovertext').text("");
  $(".hovertext").hide();
  $(".hovertext").css({});
	}
});
/**
 * tipTool with mobile on click
 */
var clickedCountry = "";
$("#svg_1").children('g').children('path').on('tap',function(e) {
	if(isMobile) {
	clickedCountry = $(this).attr('title');
	$(".hovertext").text(clickedCountry);
  $(".hovertext").css({
    'top': e.pageY -60,
    'left': e.pageX
  }).fadeIn('fast');
}
});

$('body').on('tap', function() {
	if(isMobile) {
	$(".hovertext").hide();
  $(".hovertext").css({
  })
	$('path').on('tap',function(e) {
		e.stopPropagation();
	});
}
});

/**
 * get country name if clicked on
 */

/**
 * 
 * zoom to clicked country
 */
 function reset(svg,zoom) {
	active.classed("active", false);
	active = d3.select(null);
	svg.transition().duration(750).call(zoom.transform,
		d3.zoomIdentity);
}

function stopped() {
	if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

$('path').on('touchstart',function(e) {
	documentClick = true;
});
$('path').on('touchmove',function(e) {
	documentClick = false;
});
$('path').on('click touchend',function(e) {
	if(e.type == 'click') {
		documentClick = true;
	}
	if(documentClick && clickedCountry==$(this).attr('title') || documentClick && !isMobile) {
		zoomToClick(this);
	}
});

// zoom when clicked
const zoom = d3.zoom()
	.scaleExtent([1, 8])
	.on("zoom", zoomed);

// free zoom
const zoom1 = d3.zoom()
  .scaleExtent([1, 4])
  .translateExtent([[0, 0], [1009,651]])
	.on('zoom', handleZoom);

function zoomed() {
	var g = d3.select(".map_g");
	g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
	g.attr("transform", d3.event.transform);
}

function handleZoom() {
  d3.select('.map_g')
    .attr('transform', d3.event.transform);
}

function initZoom() {
  svg.call(zoom1);
}

function stopZoom() {
	svg.on('.zoom',null);
}

if(isMobile) initZoom();

function zoomToClick(i) {
	let id = i.id;
  titleCountry = $(i).attr('title');
	var myPathBox = $("#"+id)[0].getBBox();
	let x0 = myPathBox.x;
	let y0 = myPathBox.y;
	let x1 = (x0 + myPathBox.width)*1.11;
	let y1 = y0 + myPathBox.height;

	const d = d3.dispatch("show");

  let path = svg.select('#'+id);
	svg.on("start",stopped,true);


	path.attr("class","feature");
	path.dispatch("show",clicked);
	d.call("show");

	function clicked() {
		if (active.node() === this) return reset(svg,zoom);
		active.classed("active", false);
		active = d3.select(this).classed("active", true);
		let dx = x1 - x0,
      	dy = y1 - y0,
      	x = ((x0 + x1) / 2),
      	y = (y0 + y1) / 2,
      	scale = Math.max(1, Math.min(8, 0.8 / Math.max(dx / w, dy / h))),
      	translate = [w / 2 - scale * x, h / 2 - scale * y];
		svg.transition()
		.duration(750)
		.call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale));
		getData(titleCountry);
	}
}












// ******* Load Data *********** //
/**
 * get data from json file
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

// get data from csv file 
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

// get unique objects from array
function getUniqueListBy(arr, key) {
	return [...new Map(arr.map(item => [item[key], item])).values()]
}

/**
 * get data per country name for charts
 */
 function getData(title) {
	$('.loading').css(
		'visibility', 'visible'
	);
	readCSV(csvPath,title,()=>{
	readTextFile(jsonPath, function(text){
		var data = JSON.parse(text);
		if(data[title]) {
			$('.alert').css(
				'visibility', 'hidden'
			);
		for(let i = 0; i < data[title].data.length;i++) {
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
			color: "rgb(186, 186, 186)",
			name: title,
			showInLegend: true,
			lineColor: "rgb(186, 186, 186)",
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
			color: "rgb(186, 186, 186)",
			lineColor: "rgb(186, 186, 186)",
			lineThickness: 5,
			dataPoints: dataPointsCO2perPerson
		});

		dataOption3.push({
			name: title,
			showInLegend: true,
			xValueFormatString:"Year: ####",
			yValueFormatString:"#######.## tWh",
			type: "line",
			color: "rgb(186, 186, 186)",
			lineColor: "rgb(186, 186, 186)",
			lineThickness: 5,
			dataPoints: dataPointsEnergy
		});

		dataOption4.push({
			name: title,
			showInLegend: true,
			xValueFormatString:"Year: ####",
			yValueFormatString:"#######.## t",
			type: "line",
			color: "rgb(186, 186, 186)",
			lineColor: "rgb(186, 186, 186)",
			lineThickness: 5,
			dataPoints: dataPointsMethane
		});

		if(compare==0) {
		options1['title'] = 	{
			text: title + " CO\u{2082} per year",
			fontColor: "rgb(186, 186, 186)",
			//fontSize: 40
		};
		options2['title'] = 	{
			text: title + " CO\u{2082} tons per person",
			fontColor: "rgb(186, 186, 186)",
			//fontSize: 40
		};
		options3['title'] = 	{
			text: title + " Energy consumption in terrawatt-hours",
			fontColor: "rgb(186, 186, 186)",
			//fontSize: 40
		};
		options4['title'] = 	{
			text: title + " Methan in mil tons of carbon dioxide-equivalents",
			fontColor: "rgb(186, 186, 186)",
			//fontSize: 40
		};
	} else {
		options1['title'] = 	{
			text: title + " vs. " + titleCountry2 + " CO\u{2082} per year",
			fontColor: "rgb(186, 186, 186)",
			//fontSize: 40
		};
		options2['title'] = 	{
			text: title + " vs. " + titleCountry2  + " CO\u{2082} tons per person",
			fontColor: "rgb(186, 186, 186)",
			//fontSize: 40
		};
		options3['title'] = 	{
			text: title + " vs. " + titleCountry2  + " Energy consumption in terrawatt-hours",
			fontColor: "rgb(186, 186, 186)",
			//fontSize: 40
		};
		options4['title'] = 	{
			text: title + " vs. " + titleCountry2 + " Methan in mil tons of carbon dioxide-equivalents",
			fontColor: "rgb(186, 186, 186)",
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
	} else {
		$('.alert').css(
			'visibility', 'visible'
		);
		reset(svg,zoom);
	}
	});
});
}

// get unique array
function removeDuplicateObjectFromArray(array, key) {
  var check = new Set();
  return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
}




// ************ Charts *********** //
CanvasJS.addColorSet("greenShades",
                [
								"#631010",
								"#364c78",
								"#008a17",
								"#7c7d2e",
								"#611c53",
								"#227355",
								"#443366",
								"#96562b",
                ]);

/**
 * show chart in food section
 */
 function chartFood () {
	foodChart = true;


	var chart = new CanvasJS.Chart("data_food", {
		animationEnabled: true,
		animationDuration: 1500,
		backgroundColor: "transparent",
		minwidth: '20%',
		colorSet: "greenShades",
		title:{
			text: foodChartTitle,
			horizontalAlign: "center",
			fontSize: foodChartFontTitle,
			fontFamily: 'sans-serif',
			fontWeight: "bold",
		},
		legend: {
			cursor:"pointer",
			itemclick: explodePie
		},
		data: [{
			type: "doughnut",
			startAngle: 60,
			indexLabelLineThickness: 5,
			//innerRadius: 60,
			indexLabelFontSize: foodChartFontData,
			indexLabel: "{label}  #percent%",
			toolTipContent: "<b>{label}:</b> {y} Gt (#percent%)",
			dataPoints: [
				{ y: 37636, label: "Energy" },
				{ y: 3055, label: "Industrial Processes" },
				{ y: 5794, label: "Agriculture", exploded: true},
				{ y: 1629, label: "Waste"},
				{ y: 1641, label: "Land-Use Change and Forestry"},
			]
		}]
	});
	chart.render();
	}

/**
 * initilize charts and tabs
 */
 function chart () {
	$('.loading').css(
		'visibility', 'hidden'
	);

	var options5 = {
		backgroundColor: "rgba(186, 186, 186, 0.1)",
		zoomEnabled: true,
		animationEnabled: true,
		colorSet: "greenShades",
		title: {
			text: titleCountry + " Energy Mix",
			//fontSize: 40,
			fontColor: "rgb(186, 186, 186)",
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
			indexLabelFontSize: 15,	
			indexLabelLineThickness: 4,
			indexLabelFontColor: 'rgb(186, 186, 186)',
			toolTipContent: "{name}: <strong>{y} tWh</strong>",
			indexLabel: "{name} - {y} tWh",
			dataPoints: dataPointsEnergyMix,
		}]
	};
		$("#dialogBox").dialog({
			/**
			create: function(event,ui) {
				
			},
			 */
			open: function(event,ui) {
				$(document).on('click',".ui-widget-overlay",function(e){
					e.preventDefault();
          //call dialog close function
       }),
				$("#tabs").tabs({
					create: function (event, ui) {
						event.preventDefault();
						//Render Charts after tabs have been created.
					},
					activate: function (event, ui) {
						//Updates the chart to its container size if it has changed.
						event.preventDefault();
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
			show: { effect: 'fade', duration: 250 },
			updateHash: false,
			closeOnEscape: true,
			draggable: false,
			resizable: true,
			width: $("#reveal").width()*dialogWidth,
			//minHeight: 300,
			height: $("#reveal").height()*size,
			modal: true,
			clickOut: true,
			responsive: true,
		}).dialog('widget').find(".ui-dialog-title").hide();
		$("#chartContainer1").CanvasJSChart(options1);
		$("#chartContainer2").CanvasJSChart(options2);
		$("#chartContainer3").CanvasJSChart(options3);
		$("#chartContainer4").CanvasJSChart(options4);
		if(compare == 0) {
			$("#chartContainer5").CanvasJSChart(options5);
			$($("#tabs").find("li")[4]).show();
		} else{
			$($("#tabs").find("li")[4]).hide();
		  $($("#tabs").find('#tabs-5')).hide();
		}
};

// pie chart animation
function explodePie (e) {
		if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
			e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
		} else {
			e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
		}
		e.chart.render();
}
