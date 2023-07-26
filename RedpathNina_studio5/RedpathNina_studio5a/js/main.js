
// The function is called every time when an order comes in or an order gets processed
// The current order queue is stored in the variable 'orders'
let svg = d3.select("#chart-area").append("svg")
			.attr("width", 800);

let i=0;

function updateVisualization(orders) {
	console.log(orders);

	let label = svg
		.selectAll("text")
		.remove()
		.data(orders);

	label
		.enter()
		.remove()
		.append("text")
		.attr("x", 55)
		.attr("y", 70)
		.attr("stroke", "black")
		.text("Orders: " +orders.length);

	label.exit().remove()

	let circles = svg.selectAll("circle")
					 .data(orders);

					 circles
					 .enter()
					 .remove()
					 .append("circle")
					 .attr("cx", function(d, i){
						 return 150+i*40;
					 })
					.attr("cy", 70)
					.attr("r", 10)
					.attr("fill", function(d){
						if (d.product == 'coffee'){
							return 'brown';
						}
						else {
							return 'salmon';
						}
					});

	circles.exit().remove();
}

