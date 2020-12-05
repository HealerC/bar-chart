tippy("#more-info", {
	content: `A Guide to the National Income and Product Accounts of the United States 
			  (NIPA)<br /><a href="http://www.bea.gov/national/pdf/nipaguid.pdf" target="_blank">
			  			http://www.bea.gov/national/pdf/nipaguid.pdf</a>`,
	interactive: true,
	allowHTML: true,
	theme: "light"
});

document.addEventListener("DOMContentLoaded", function() {
	let dataset = [];

	fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
	    .then(result => result.json())
	    .then(data => {
	    	dataset = data.data;
	    	renderData(dataset);
	    });

	window.onresize = function() {
		d3.select("svg").selectAll("*").remove();
		renderData(dataset);
	}
});

function renderData(data) {
	const svg = d3.select("svg");

	let width = svg.style("width");
	width = +width.substring(0, width.indexOf("px"));

	let height = svg.style("height")
	height = +height.substring(0, height.indexOf("px"));

	padding = 63;
	const xScale = d3.scaleBand()
					 .domain(data.map(d => d[0]))
					 .range([padding, width - padding])
					 .padding(0.3)
					 .round(true)
					 .align(0.1);
	const yScale = d3.scaleLinear()
					 .domain([0, d3.max(data.map(d => d[1]))])
					 .range([height - padding, padding]);

	const bars = svg.selectAll("rect")
	   				.data(data)
					.enter()
					.append("rect")
					.attr("class", "bar")
					.attr("data-date", (d) => d[0])
					.attr("data-gdp", (d) => d[1])
					.attr("x", (d) => xScale(d[0]))
					.attr("y", (d) => yScale(d[1]))
					.attr("width", xScale.bandwidth())
					.attr("height", (d) => height-padding - yScale(d[1]))

	const { xg, yg } = renderAxis(svg, xScale, yScale, { height, padding });
	renderAxisLabel(xg, yg, { width, height });
	renderTooltip(bars);
}

function renderAxis(svg, xScale, yScale, dimensions) {
	const { height, padding } = dimensions;

	const xAxis = d3.axisBottom(xScale)
						.tickValues(getTickValues(xScale))
						.tickFormat(d => d.substring(0, 4));

	const yAxis = d3.axisLeft(yScale);

	const xg = svg.append("g")
				  .attr("id", "x-axis")
	   			  .attr("transform", `translate(0, ${height-padding})`)
	   			  .call(xAxis);

	const yg = svg.append("g")
				  .attr("id", "y-axis")
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
	return { xg, yg };
}
function renderAxisLabel(xg, yg, dimensions) {
	const { width, height } = dimensions;
	xg.append("text")
	  .attr("class", "label")
	  .text("Year (Quaterly from 1947 to 2015)")
	  .attr("x", width/2)
	  .attr("y", 45);

	yg.append("text")
	  .attr("class", "label")
	  .text("Gross Domestic Product (billions of dollars)")
	  .attr("x", -(height-350)/2)
	  .attr("y", -50)
	  .attr("transform", `rotate(-90)`);
}

function renderTooltip(bars) {
	const tooltip = d3.select("body")
					   .append("div")
					   .attr("id", "tooltip")
					   .style("visibility", "hidden");
	
	bars.on("mouseover", function(event, d) {
		let tooltipDisplay = getDisplay(d);
		//console.log(tooltipDisplay);
		tooltip.style("visibility", "visible")
		       .html(getDisplay(d))
		       .attr("data-date", d[0])
		       .style("left", (event.pageX+30) + "px")
	      	   .style("top", (0.6*screen.availHeight) + "px");
	})
	.on("mouseout", () => {
		tooltip.style("visibility", "hidden");
	})

	function getDisplay(d) {
		let output = "";
		let date = new Date(d[0]);

		output += date.getFullYear();
		
		const month = date.getMonth();

		output += " Q";
		switch (month) {
			case 0:
				output += 1;
				break;
			case 3:
				output += 2;
				break;
			case 6:
				output += 3;
				break;
			case 9:
				output += 4;
				break;
			default:
				output += 0;
		}

		output += "<br />";
		output += `${d[1]} billion`;

		return output;
	}
}