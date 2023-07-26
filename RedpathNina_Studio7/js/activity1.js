
var width = 400,
    height = 400;

var svg = d3.select("#chart-area").append("svg")
    // .attr("width", width)
    // .attr("height", height)
    .attr("viewBox", "-100 -100 " + width + " " + height );

// Load data
d3.json("data/airports.json").then(function(data) {
  console.log(data);

  // i) INITIALIZE FORCE-LAYOUT AND DEFINE 'NODES' AND 'EDGES'

  var simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).distance(20));

  
  // ii) DRAW THE LINKS (SVG LINE)
  var link = svg.selectAll(".link")
        .data(data.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "grey");

  // iii) DRAW THE NODES (SVG CIRCLE)

  var node = svg.selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 1)
        .attr("stroke", 1)
        .attr("fill", function(d){
          if (d.country == "United States"){
            return "blue"
          }
          else {
              return "red"
          }
        })
        .on("click", function(d){
          node.append("title")
          .text(d.name)
          .style("fill", "black")
          .attr("font-size", 12)
}
        );

  // iv) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS

  simulation.on("tick", function() {

    // Update node coordinates
    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.x);

    // Update edge coordinates
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)

});


node.call(d3.drag()
  .on("start", dragstart)
  .on("drag", drag)
  .on("end", dragend));


function showTitle(){
node.append("title")
  .text(function(d) { return d.name; })
  .style("fill", "black")
  .attr("font-size", 12)
}


  // FUNCTIONS: 
function dragstart(d) {
  if (!d.active) simulation.alphaTarget(0.3).restart();
  d.subject.fx = d.subject.x;
  d.subject.fy = d.subject.y;
}

function drag(d) {
  d.subject.fx = d.x;
  d.subject.fy = d.y;
}

function dragend(d) {
  if (!d.active) simulation.alphaTarget(0);
  d.subject.fx = null;
  d.subject.fy = null;
}

//scale things 

});