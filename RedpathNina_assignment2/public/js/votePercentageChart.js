/**
 * Constructor for the Vote Percentage Chart
 */
function VotePercentageChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 200;

    //creates svg element within the div
    self.svg = divvotesPercentage.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
VotePercentageChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party == "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
VotePercentageChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<ul>";
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+" ("+row.percentage+"%)" + "</li>"
    });

    return text;
}

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function(electionResult){
    var self = this;

    // console.log("HERE")

    let total_d_votes=0;
    let total_r_votes = 0;
    let total_i_votes = 0;
    let total_votes =0
    let D_Nominee;
    let R_Nominee;
    let I_Nominee;

    electionResult.forEach((element ) => {  
        element.D_Votes = +element.D_Votes;
        element.I_Votes = +element.I_Votes;
        element.R_Votes = +element.R_Votes;
        element.Total_EV = +element.Total_EV;

        total_votes += element.D_Votes + element.R_Votes + element.I_Votes;
        total_d_votes += element.D_Votes;
        total_r_votes += element.R_Votes;
        total_i_votes += element.I_Votes;
        D_Nominee = element.D_Nominee;
        R_Nominee = element.R_Nominee;
        I_Nominee = element.I_Nominee;

    });

    let votes_percentage = [{party: 'I', person: I_Nominee, percent: 100*total_i_votes/total_votes}, {party: 'D', person: D_Nominee, percent: 100*total_d_votes/total_votes}, {party: 'R', person: R_Nominee, percent: 100*total_r_votes/total_votes}, {person: null, party: null, percent: null}]
    // console.log(votes_percentage);


    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            //  populate data in the following format
             tooltip_data = {
             "result":[
             {"nominee": D_Nominee,"votecount": total_d_votes,"percentage": votes_percentage[1].percent,"party":"D"} ,
             {"nominee": R_Nominee,"votecount": total_r_votes,"percentage": votes_percentage[2].percent,"party":"R"} ,
             {"nominee": I_Nominee,"votecount": total_i_votes,"percentage": votes_percentage[0].percent,"party":"I"}
             ]
             }
            //  * pass this as an argument to the tooltip_render function then,
            //  * return the HTML content returned from that method.
            // console.log(self.tooltip_render(tooltip_data))
            //  * */
            return self.tooltip_render(tooltip_data);
        });


    // ******* TODO: PART III *******
    var x = d3.scaleLinear()
    .range([0, self.svgWidth])
    .domain([0, 100])

    let x_pos = 0;

    let percent_chart = this.svg.selectAll('rect')
        .data(votes_percentage);

    percent_chart
        .enter()
        .append("rect")
        .merge(percent_chart)
        .attr("class", "votePercentage")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .transition()
        .duration(2000)
        .attr("width", function(d){
            if (d.percent!= null){
            return x(d.percent);
            }
            else {
                return 0;
            }
        })
        .call(tip)
        .attr("fill",function(d){
            if (d.party == "I"){
                return "#229954"
            }
            else if (d.party=="R"){
                return '#ff3333'
                // return colorSca/le(d.R_Percentage-20)
            }
            else {
                // console.log(intensity)
                return '#3399FF'
            }
        })
        .attr("y", 40)
        .attr("x", function(d,i){
            x_pos += d.percent
            return x(x_pos-d.percent);
        })
        .attr("height", 35);
    
    percent_chart.exit().remove()

    let percent_labels = this.svg.selectAll("text")
    .data(votes_percentage)

    percent_labels
        .enter()
        .append("text")
        .merge(percent_labels)
        .text(function(d){
            if (d.percent != 0.00 && d.percent != null){
                let string = d.person + ', ' + d.percent.toFixed(2) +'%';
                return string;
            }
            else if (d.percent == null){
                return "Popular Vote (50%)"
            }
        })
        .transition()
        .duration(2000)
        .attr("x", function(d,i){
            let len  = 30;
            let ind_pos = 0;
            if (i==0){
                ind_pos += x(d.percent)+len;
                return 3*len;
            }
            else if (i==2){
                return self.svgWidth-(4*len);
            }
            else if (i==1){
                if (votes_percentage[0].percent==0){
                    return 3.6*len
                }
                else {
                    return x(d.percent);
                }
            }
            else {
                return self.svgWidth/2.0
            }
        })
        .attr("y", function(d){
            if (d.percent== null){
                return 11;
            }
            else {
                return 30;
            }
        })
        .attr("class", "yeartext");

    percent_labels.exit().remove();

    let center_line_pv = this.svg.selectAll('line').data(electionResult)

    center_line_pv
            .enter()
            .remove()
            .merge(center_line_pv)
            .append("line")
            .style("stroke", "slategray")
            .style("stroke-width", 1.5)
            .attr("x1", self.svgWidth/2)
            .attr("y1", 33)
            .attr("x2", self.svgWidth/2)
            .attr("y2", 82); 

    center_line_pv.exit().remove();


    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.

    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
    //then, vote percentage and number of votes won by each party.

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

};
