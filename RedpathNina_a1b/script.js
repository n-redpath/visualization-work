/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)
document.getElementById("staircase-button").addEventListener("click", staircase);
document.getElementById("dataset").addEventListener("change", changeData);
document.getElementById("random").addEventListener("change", randomSubset);
window.addEventListener('load', changeData)

// changing color on hover.
document.querySelectorAll("rect").forEach(item => {
    item.addEventListener("mouseover", event => {
        item.style.fill = "green";
    })
    item.addEventListener("mouseleave", event => {
        item.style.fill= "steelblue";
    })
});

function staircase() {
    var children = document.getElementById("firstchart").children;
    // ****** TODO: PART II ******
    var len = 0;

    for (var i= children.length-1; i>=0; i--){
        // children[i].style= "fill: blue";
        len = children.length-i;
        children[i].style= "fill: steelblue; width: " + len;
    }
}

function update(data) {
    // D3 loads all CSV data as strings;
    // while Javascript is pretty smart
    // about interpreting strings as
    // numbers when you do things like
    // multiplication, it will still
    // treat them as strings where it makes
    // sense (e.g. adding strings will
    // concatenate them, not add the values
    // together, or comparing strings
    // will do string comparison, not
    // numeric comparison).

    // We need to explicitly convert values
    // to numbers so that comparisons work
    // when we call d3.max()
    data.forEach(function (d) {
        d.a = parseInt(d.a);
        d.b = parseFloat(d.b);
    });

    // Set up the scales
    var aScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([0, 150]);
    var bScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([0, 150]);
    var iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);

    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
    var abar = d3.select("body").selectAll("rect")
        .data(data)
        .style("fill", "steelblue")
        .attr("width", function(d){
            return d.a;
        });

    abar.exit().transition().remove();

    abar
    .data(data)
    .enter()
    .append("rect")
    .attr("height", 1)
    .transition()
    .duration(2000)
    .attr("width", function(d){
        return d.a;
    })
    .attr("y", function(d, i){
        return data.length-i-1;
    })
    .attr("fill", "steelblue");
    

    // TODO: Select and update the 'b' bar chart bars
    bbar = d3.select("#secondchart").selectAll("rect")
        .data(data)
        .style("fill", "steelblue")
        .attr("width", function(d){
            return d.b;
        });
    bbar.exit().remove();

    bbar.data(data)
        .enter()
        .append("rect")
        .transition()
        .duration(2000)
        .attr("height", 1)
        .attr("width", function(d){
            return d.b;
        })
        .attr("y", function(d, i){
            return data.length-i-1;
        })
        .attr("fill", "steelblue");

    // TODO: Select and update the 'a' line chart path using this line generator
    var aLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i)/5;
        })
        .y(function (d) {
            return 25 -aScale(d.a)/8;
        });
    
    d3.select("#aline")
        .data(data)
        .transition()
        .duration(2000)
        .style("stroke-width", "0.4px")
        .style("stroke", "purple")
        .attr("d", aLineGenerator(data));        
    
    // TODO: Select and update the 'b' line chart path (create your own generator)
    var bLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i)/6;
        })
        .y(function (d) {
            return 25-bScale(d.b)/8;
        })


    d3.select("#bline")
        .data(data)
        .transition()
        .duration(2000)
        .style("stroke-width", "0.4px")
        .style("stroke", "purple")
        .attr("d", bLineGenerator(data));
             

    // TODO: Select and update the 'a' area chart path using this line generator
    var aAreaGenerator = d3.area()

        .x(function (d, i) {
            return iScale(i)/5;
        })
        .y0(30)
        .y1(function (d) {
            return 30-aScale(d.a)/5;
        });

    d3.select("#aarea")
        .data(data)
        .transition()
        .duration(2000)
        .attr("d", aAreaGenerator(data));

    // TODO: Select and update the 'b' area chart path (create your own generator)
    var bAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i)/5;
        })
        .y0(30)
        .y1(function (d) {
            return 30-bScale(d.b)/5;
        });

    d3.select("#barea")
        .data(data)
        .transition()
        .duration(2000)
        .attr("d", bAreaGenerator(data));

    // TODO: Select and update the scatterplot points

    var scatterplot = d3.select("#scatterplot").selectAll("circle")
        .data(data)
        .attr("r", 0.5)
        .style("fill", "steelblue")
        .on("click", function(a, b){
            console.log("Point Coordinates are x: "+ b.a + " y: " + b.b);
        })
        .attr("cx", function(d){
            return d.a;
        })
        .attr("cy", function(d){
            return d.b;
        });
    
    scatterplot.exit().remove()

    scatterplot.data(data)
        .enter()
        .append("circle")
        .attr("r", .5)
        .style("fill", "steelblue")
        .on("click", function(a, b){
            console.log("Point Coordinates are x: "+ b.a + " y: " + b.b);
        })
        .attr("cx", function(d){
            return d.a;
        })
        .attr("cy", function(d){
            return d.b;
        });

    // ****** TODO: PART IV ******
}

function changeData() {
    // // Load the file indicated by the select menu
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else{
        d3.csv('data/' + dataFile + '.csv').then(update);
    }
}

function randomSubset() {
    // Load the file indicated by the select menu,
    // and then slice out a random chunk before
    // passing the data to update()
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv').then(function(data) {
            var subset = [];
            data.forEach(function (d) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            });
            console.log(subset);
            update(subset);
        });
    }
    else{
        changeData();
    }
}