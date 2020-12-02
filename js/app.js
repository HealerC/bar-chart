tippy("#more-info", {
	content: `A Guide to the National Income and Product Accounts of the United States 
			  (NIPA)<br /><a href="http://www.bea.gov/national/pdf/nipaguid.pdf" target="_blank">
			  			http://www.bea.gov/national/pdf/nipaguid.pdf</a>`,
	interactive: true,
	allowHTML: true
});

document.addEventListener("DOMContentLoaded", function() {

	fetch("./GDP-data.json")
	    .then(result => result.json())
	    .then(data => {
	    	const xData = data.data.map(d => d[0]);
	    	const yData = data.data.map(d => d[1]);
	    	renderData(xData, yData);
	    });
});

function renderData(xData, yData) {
	const svg = d3.select("svg");

	let width = svg.style("width");
	width = +width.substring(0, width.indexOf("px"));

	let height = svg.style("height")
	height = +height.substring(0, height.indexOf("px"));

	padding = 60;

	const xScale = d3.scaleBand()
					 .domain(xData)
					 .range([padding, width - padding])
					 .padding(0.3)
					 .round(true);

	const yScale = d3.scaleLinear()
					 .domain([0, d3.max(yData)])
					 .range([height - padding, padding]);

	
}