var spec;
d3.select("#ranking-type").on("change", updateVisualization);

// SVG drawing area
var margin = {top: 40, right: 10, bottom: 60, left: 60};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Scales
var x = d3.scaleBand()
    .rangeRound([0, width])
	.paddingInner(0.1);

var y = d3.scaleLinear()
    .range([height, 0]);


// Initialize data
loadData();

// Create a 'data' property under the window object
// to store the coffee chain data
Object.defineProperty(window, 'data', {
	// data getter
	get: function() { return _data; },
	// data setter
	set: function(value) {
		_data = value;
		// update the visualization each time the data property is set by using the equal sign (e.g. data = [])
		updateVisualization();
	}
});

// Load CSV file
function loadData() {
	d3.csv("data/coffee-house-chains.csv").then(function(csv) {

		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
		});

		// Store csv data in global variable
		data = csv;
		// console.log(data)
		// updateVisualization gets automatically called within the data = csv call;
		// basically(whenever the data is set to a value using = operator);
		// see the definition above: Object.defineProperty(window, 'data', { ...

	});

}

var y_axis = svg.append("g")
    .attr("class", "y-axis axis")
	.attr("transform", "translate(-40,1)");

var x_axis = svg.append("g")
	.attr("class", "x-axis axis")
	.attr("transform", "translate(0,430)");
// Render visualization
function updateVisualization() {

  console.log("called");
  spec = d3.select("#ranking-type").property("value");

  data.sort(function(a, b){
	  if (spec == 'stores'){
		console.log("sorting by store")
	  	return b.stores-a.stores;
	  }
	  else {
		console.log("sorting by rev")
		return b.revenue-a.revenue;
	  }
  })

  console.log(data);

  let xAxis = d3.axisBottom();
  xAxis.scale(x);	
  let yAxis = d3.axisRight();
  yAxis.scale(y);

  svg.select(".y-axis")
    .transition()
	.duration(2000)
	.call(yAxis);

  svg.select(".x-axis")
  	.transition()
	.duration(2000)
  	.call(xAxis);

  x.domain(data.map(function(d) {return d.company; }));
  y.domain([0, d3.max(data, function(d){
	if (spec=='stores'){
		return d.stores;
	}
	else{
		return d.revenue;
	}})])

	svg.select(".y-axis")
		.transition()
		.duration(2000)
        .call(yAxis);
	svg.select(".x-axis")
		.call(xAxis);

//   console.log(data);
  let rects = svg.selectAll("rect").data(data);

  rects.
		enter()
		.remove()
		.append("rect")
		.merge(rects)
		.attr('class', function(d){
			return "bar"
		})
		.attr("x", function(d) { return x(d.company); })
		.attr("y", function(d) { 
			if (spec == 'stores'){
				return y(d.stores);
			}
			else{
				return y(d.revenue);
			}})
		.attr("width", x.bandwidth())
		.transition()
		.duration(2000)
		.attr("height", function(d) { 
			if (spec == 'stores'){
				return (height - y(d.stores))
			}
			else {
				return (height - y(d.revenue))
			}})

	rects.exit().remove();

	
	


}
