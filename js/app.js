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
	    	renderData(data.data);
	    });
});

function renderData(data) {
	const svg = d3.select("svg");

	let width = svg.style("width");
	width = +width.substring(0, width.indexOf("px"));

	let height = svg.style("height")
	height = +height.substring(0, height.indexOf("px"));

	padding = 60;
	const xScale = d3.scaleBand()
					 .domain(data.map(d => d[0]))
					 .range([padding, width - padding])
					 .padding(0.3)
					 .round(true);

	const yScale = d3.scaleLinear()
					 .domain([0, d3.max(data.map(d => d[1]))])
					 .range([height - padding, padding]);

	svg.selectAll("rect")
	   .data(data)
	   .enter()
	   .append("rect")
	   .attr("x", (d) => xScale(d[0]))
	   .attr("y", (d) => yScale(d[1]))
	   .attr("width", xScale.bandwidth())
	   .attr("height", (d) => height-padding - yScale(d[1]));
}