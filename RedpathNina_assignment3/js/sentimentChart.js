/**
 * Constructor for the sentiment chart 
 */
 function SentimentChart(){
    var self = this;
    self.init();
};
// global variable
let hasBeenCalled = false;
/**
 * Initializes the svg elements required for this chart
 */
SentimentChart.prototype.init = function(){
  // this code was taken from the assignment 2 template
    var self = this;
    self.margin = {top: 30, right: 0, bottom: 30, left: 0};
    var sentimentChartDiv = d3.select("#sentiment-chart").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = sentimentChartDiv.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width;
    self.svgHeight = 240;

    self.svg = sentimentChartDiv.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight);

};

// external axes label function 
function labelAxes(x, y ){
  x.append("text")
  .text("Time (word location in the story)")
  .attr("x", 300)
  .attr("y", 55)
  .attr("transform", "translate(0, -20)")
  .style("fill", "black")
  .style("font-size", 14);


  y.append("text")
  .text("Sentiment Score")
  .attr("x", 20)
  .attr("y", 410)
  .attr("transform", "translate(-440, 90) rotate(-90)")
  .style("fill", "black")
  .style("font-size", 14);


}

/**
 * @param fairyTale election data for the year selected
 */
SentimentChart.prototype.update = function(fairyTale){
    var self = this;

  // CREATE AXES:
  self.x = d3.scaleLinear()
           .range([0, self.svgWidth/2])
           .domain(d3.extent(fairyTale.content, function(d) { return d.index; }));

  self.y = d3.scaleLinear()
      .range([self.svgHeight-40, 0])
      .domain(d3.extent(fairyTale.content, function(d) { return d.score; }));

  let xAxis = d3.axisBottom()
  .scale(self.x)
  .ticks(5)
  .tickPadding(6);

  let yAxis = d3.axisLeft()
  .scale(self.y)
  .ticks(7)
  .tickPadding(6);

  
    
  let x_axis_g = self.svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(40," + (self.svgHeight-40) + ")")
    

  let y_axis_g =     self.svg.append("g")
 .attr("class", "y-axis axis")
 .attr("transform", "translate(40, -3)")


 if (!hasBeenCalled){
  hasBeenCalled = true;
  labelAxes(x_axis_g, y_axis_g);
}

//  this code is taken from studio 6 (the axis class code is in the css file)
self.svg.select(".x-axis").call(xAxis);
self.svg.select(".y-axis").call(yAxis);



  //make a scale for the indices: 
  let indexScale = d3.scaleLinear()
                .domain([d3.min(fairyTale.content, function(d){return d.index}), d3.max(fairyTale.content, function(d){return d.index})])
                .range([0, self.svgWidth/2])

  let scoreScale = d3.scaleLinear()
                .domain([d3.min(fairyTale.content, function(d){return d.score}), d3.max(fairyTale.content, function(d){return d.score})])
                .range([self.svgHeight-40, 0]);


  // STEP TWO - GRAPH THE DATA. 
  self.area_gen = d3.area().
                x(function(d){
                  return indexScale(d.index);
                })
                .y0(function (d) {return 200.39})
                .y1(function (d) {
                  return scoreScale(d.score)
                });


  var graph = self.svg.selectAll(".area")
            .data(fairyTale.content);

  graph.enter().append("path")
            .attr("class", "area")
            .merge(graph)
            .attr("transform", "translate(40, 0)")
            .style("fill", "#575151")
            .style("opacity", .5)
            .transition()
            .duration(2000)
            .attr("d", function(d, i) {
                if (i==0){
                return self.area_gen(fairyTale.content);
                }
            })

  graph.exit().transition().duration(2000).remove();

};
