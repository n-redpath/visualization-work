
// SVG Size
var width = 700,
	height = 500;

// Load CSV file
d3.csv('data/wealth-health-2014.csv').then(function(data) {

	// Analyze the dataset in the web console
	
	for (var i=0; i<data.length; i++){
		data[i].LifeExpectancy = +data[i].LifeExpectancy;
		data[i].Income = +data[i].Income;
		data[i].Population = +data[i].Population;
		// console.log(data[i].Region)
	}

	data.sort(function(a,b){
		return a.Population - b.Population;
	})


	// console.log("Countries: " + data.length)
	let padding = 35;

	let incomeScale = d3.scaleLog()
		.domain([d3.min(data, function(d){return d.Income})-100, d3.max(data, function(d){return d.Income})-100])
		.range([padding, width-padding]); 

	// Creating a scale function
	let LifeExpectancyScale = d3.scaleLinear()
	.domain([d3.min(data, function(d){return d.LifeExpectancy}), d3.max(data, function(d){return d.LifeExpectancy})])
	.range([height-padding, padding]); 

	let radiusScale = d3.scaleLinear()
		.domain([d3.min(data, function(d){return d.Population}), d3.max(data, function(d){return d.Population})])
		.range([4, 30])

	let colorScale = d3.scaleOrdinal()
		.domain(["America", "South Asia", "Sub-Saharan Africa", "East Asia & Pacific", "Europe & Central Asia", "Middle East & North Africa"])
		.range(["#9b2226","#bb3e03", "#ee9b00", "#ffdd00", "#e63946", "#370617"])
	
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d){
			return incomeScale(d.Income);
		})
		.attr("cy", function(d){
			return LifeExpectancyScale(d.LifeExpectancy);
		})
		.attr("r", function(d){
			return radiusScale(d.Population);
		})
		.attr("stroke", "black")
		.attr("fill", function(d){
			return colorScale(d.Region)
		})

	// scale function for circles. 
	

	// create d3 axis functions : 
	let xAxis = d3.axisTop();

	// Pass in the scale function
	xAxis.scale(incomeScale);	

	let yAxis = d3.axisRight();
	yAxis.scale(LifeExpectancyScale);

	svg.append("g")
		.attr("transform", "translate(10,1)")
		.call(yAxis)
		.append("text")
		.text("Y axis label")
		.attr("x", 10)
		.attr("y", 400)
		.attr("transform", "translate(-400, 300) rotate(-90)")
		.style("fill", "black")
		.style("font-size", 14)


	svg.append("g")
		.attr("transform", "translate(0,487)")
		.call(xAxis)
		.append("text")
		.text("X axis label")
		.attr("transform", "translate(300, 12)")
		.style("fill", "black")
		.style("font-size", 14)
});

let svg = d3.select("#chart-area")
	.append("svg")
	.attr("width", width)
	.attr("height", height);


// Creating a scale function
