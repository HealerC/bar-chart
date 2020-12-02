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
	console.log(xData);
	console.log(yData);
}