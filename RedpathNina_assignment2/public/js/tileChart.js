/**
 * Constructor for the TileChart
 */
function TileChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required to lay the tiles
 * and to populate the legend.
 */
TileChart.prototype.init = function(){
    var self = this;

    //Gets access to the div element created for this chart and legend element from HTML
    var divTileChart = d3.select("#tiles").classed("content", true);
    var legend = d3.select("#legend").classed("content",true);
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    var svgBounds = divTileChart.node().getBoundingClientRect();
    self.svgWidth = svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgWidth/2;
    var legendHeight = 150;

    //creates svg elements within the div
    self.legendSvg = legend.append("svg")
        .attr("width",self.svgWidth+50)
        .attr("height",legendHeight)
        .attr("transform", "translate(" + self.margin.left + ",0)")

    self.svg = divTileChart.append("svg")
                        .attr("width",self.svgWidth)
                        .attr("height",self.svgHeight)
                        .attr("transform", "translate(" + self.margin.left + ",0)")
                        .style("bgcolor","green")

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
TileChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party== "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Renders the HTML content for tool tip.
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for tool tip
 */
TileChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<h2 class ="  + self.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
    text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
    text += "<ul>"
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });
    text += "</ul>";
    return text;
}

/**
 * Creates tiles and tool tip for each state, legend for encoding the color scale information.
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */
TileChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    let grid = [['AK', '     ', '    ', ' ', '   ', ' ', '', '', '   ', '', ' ', 'ME'], 
                ['', '', '', '', '', '    ', '     ', '         ', '', '', 'VT', 'NH'], 
                ['', 'WA', 'ID', 'MT', 'ND', 'MN', 'IL', 'WI', 'MI', 'NY', 'RI', 'MA'], 
                ['', 'OR', 'NV', 'WY', 'SD', 'IA', 'IN', 'OH', 'PA', 'NJ', 'CT', ''], 
                ['', 'CA', 'UT', 'CO', 'NE', 'MO', 'KY', 'WV', 'VA', 'MD', 'DC', ''], 
                ['', '  ', 'AZ', 'NM', 'KS', 'AR', 'TN', 'NC', 'SC', 'DE', '', ''], 
                ['', '  ', '  ', '  ', 'OK', 'LA', 'MS', 'AL', 'GA', '', '', ''], 
                ['', 'HI', '  ', '  ', 'TX', '  ', '  ', '  ', '  ', 'FL', '', '']]


    electionResult.forEach((element ) => {
        //assign each state a space and a row, on a 8x12 grid. 
        for (let i=0; i<grid.length; i++){
            for (let j=0; j<grid[0].length; j++){
                if (grid[i][j] == element.Abbreviation) {
                    element.Row = i;
                    element.Space = j;
                }
            }
        }
        // console.log(element)        
        // console.log("State: " + element.Abbreviation + ", Row: " + element.Row + ", Column: " + element.Space)
    })
    //give all states a space and a row. 




    //Calculates the maximum number of columns to be laid out on the svg
    self.maxColumns = d3.max(electionResult,function(d){
                                return parseInt(d["Space"]);
                            });

    //Calculates the maximum number of rows to be laid out on the svg
    self.maxRows = d3.max(electionResult,function(d){
                                return parseInt(d["Row"]);
                        });
    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('se')
        .offset(function(event, d) {
            return [0,0];
        })
        .html(function(event, d) {
            //  populate data in the following format
            tooltip_data = {
            "state": d.State,
            "winner": d.State_Winner,
            "electoralVotes" : d.Total_EV,
            "result":[
            {"nominee": d.D_Nominee,"votecount": d.D_Votes,"percentage": d.D_Percentage,"party":"D"} ,
             {"nominee": d.R_Nominee,"votecount": d.R_Votes,"percentage": d.R_Percentage,"party":"R"} ,
             {"nominee": d.I_Nominee,"votecount": d.I_Votes,"percentage": d.I_Percentage, "party":"I"}
             ]
            }
            //  * pass this as an argument to the tooltip_render function then,
            //  * return the HTML content returned from that method.
            //  * */
            return self.tooltip_render(tooltip_data);
        });

    //Creates a legend element and assigns a scale that needs to be visualized
    self.legendSvg.append("g")
        .attr("class", "legendQuantile")
        .style("font-size", 10);
    

    var legendQuantile = d3.legendColor()
        .shapeWidth(68)
        .cells(10)
        .orient('horizontal')
        .scale(colorScale);


    d3.select(".legendQuantile").call(legendQuantile)
    // let xScale = d3.scaleLinear()
    //     .range([0, self.svgWidth])
    //     .domain([0, self.maxRows])

    // let yScale = d3.scaleLinear()
    //     .range([0, self.svgHeight])
    //     .domain([0, self.maxColumns])

    // ******* TODO: PART IV *******
    //Tansform the legend element to appear in the center and make a call to this element for it to display.

    //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.
let tileChart = this.svg.selectAll('rect')
            .data(electionResult);

tileChart
    .enter()
    .append("rect")
    .merge(tileChart)
    .attr("width", 65)
    .attr("class", 'tiles')
    .attr("fill",function(d){
        if (d.party == "I"){
            return "#229954"
        }
        else if (d.party=="R"){
            let intensity = (d.R_Percentage-23)
            return colorScale(intensity)
        }
        else {
            let intensity = -1*((d.D_Percentage)/1.3)+20;
            return colorScale(intensity)
        }
    })
    .attr("y", function(d,i){
        return d.Row*(self.svgHeight/(self.maxRows+2));
    })
    .attr("x", function(d,i){
        return d.Space*(self.svgWidth/(self.maxColumns+2));
    })
    .attr("height", 45)
    .call(tip)
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)

tileChart.exit().remove()

let state_labels = this.svg.selectAll("text").data(electionResult);

state_labels
    .enter()
    .append('text')
    .merge(state_labels)
    .text(function(d){
        let string = d.Abbreviation + ": " + d.Total_EV;
        return string;
    })
    .transition()
    .duration(2000)
    .attr("y", function(d,i){
        return d.Row*(self.svgHeight/(self.maxRows+2))+21;
    })
    .attr("x", function(d,i){
        return d.Space*(self.svgWidth/(self.maxColumns+2))+31;
    })
    .attr("class", "yeartext")
    .style('font-size', "8px");

state_labels.exit().remove();



    //Display the state abbreviation and number of electoral votes on each of these rectangles

    //HINT: Use .tile class to style your tiles;
    // .tilestext to style the text corresponding to tiles

    //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
    //then, vote percentage and number of votes won by each party.
    //HINT: Use the .republican, .democrat and .independent classes to style your elements.
};
