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
	   .attr("height", (d) => height-padding - yScale(d[1]))

	const { xg, yg } = renderAxis(svg, xScale, yScale, { height, padding });
}

function renderAxis(svg, xScale, yScale, dimensions) {
	const { height, padding } = dimensions;

	const xAxis = d3.axisBottom(xScale)
						.tickValues(getTickValues(xScale))
						.tickFormat(d => d.substring(0, 4));

	const yAxis = d3.axisLeft(yScale);

	const xg = svg.append("g")
	   			  .attr("transform", `translate(0, ${height-padding})`)
	   			  .call(xAxis);

	const yg = svg.append("g")
	   			  .attr("transform", `translate(${padding}, 0)`)
	              .call(yAxis);

	function getTickValues(scale) {
		let filteredScale = [];

		scale.domain().forEach(d => {
			let value = +d.substring(0, 4);
			if (value % 5 === 0 && !checkArray(filteredScale, value)) {
				filteredScale.push(d);
			}
		});

		return filteredScale;

		function checkArray(arr, value) {
			let re = new RegExp(value, "i");
			for (let data in arr) {
				if (re.test(arr[data])) {
					return true;
				}
			}
			return false;
		}
	}
	return { xg, yg }
}