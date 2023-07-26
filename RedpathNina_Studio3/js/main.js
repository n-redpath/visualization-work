// From Activity One: 
// d3.select("body").append("h4").text("Dynamic Content!");

// For Activity 2: 
// var sandwiches = [
//     { name: "Thesis", price: 7.95, size: "large" },
//     { name: "Dissertation", price: 8.95, size: "large" },
//     { name: "Highlander", price: 6.50, size: "small" },
//     { name: "Just Tuna", price: 6.50, size: "small" },
//     { name: "So-La", price: 7.95, size: "large" },
//     { name: "Special", price: 12.50, size: "small" }
//   ];

//   var cont = d3.select("svg")

//   cont
//     .selectAll("circle")
//     .data(sandwiches)
//     .enter()
//     .append("circle")
//     .attr("cx", function(d, index) {
//         return (index * 40+20);
//       }
//     )
//     .attr("cy", 15)
//     .attr("r", function(d){
//         if (d.size == "large"){
//             return 12;
//         }
//         else {
//             return 6;
//         }
//     })
//     .style("fill", function(d){
//         if (d.price < 7.00){
//             return "green";
//         }
//         else {
//             return "red";
//         }
//     })
//     .style("stroke", "grey")


var EUcities = []

d3.csv("js/cities.csv")
  .then(data => {
    console.log("Data loading complete. Work with dataset.");
    console.log(data)
    for (var i=0; i<data.length; i++){
        if (data[i].eu == "true"){
            data[i].population = +data[i].population;
            data[i].x = +data[i].x;
            data[i].y = +data[i].y;
            EUcities.push(data[i]);
        }
    }
    console.log(EUcities.length)
    d3.select("#numcities").append("p").text("Total Number of cities in the EU: " + EUcities.length);
    d3.select("svg").selectAll("circle")
        .data(EUcities)
        .enter()
        .append("circle")
        .attr("r", function(d){
            if (d.population < 1000000){
                return 4;
            }
            else {
                return 8;
            }
        })
        .attr("cx", function(d){
            return d.x;
        })
        .attr("cy", function(d){
            return d.y;
        })
        .attr("class", "city-label")
        .style("fill", "pink")
        .append('text')
        .text(function(d){

            if (d.population >=1000000){
                return d.city;
            }
            else{
                return;
            }
        })
        .style("text-anchor", "middle")
        .style("color", "black")
        .attr("font-size", 10)
        .attr("opacity", function(d){
            if (d.population >= 1000000){
                return 1;
            }
            else {
                return 0;
            }
        })
        .attr("x", function(d){return d.x + 10})
        .attr("y", function(d){return d.y + 20})
    // the above code doesnt seem to be displaying

  })
  .catch(error => {
    console.error("Error loading the data")
  });

console.log("Do something else, without the data");


