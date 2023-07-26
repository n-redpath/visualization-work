
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param brushSelection an instance of the BrushSelection class
 */
function ElectoralVoteChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#electoral-vote").classed("content", true);
    self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 150;

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
ElectoralVoteChart.prototype.chooseClass = function (party) {
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
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */

ElectoralVoteChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    // ******* TODO: PART II *******

    let democratic_states  = []
    let republican_states = []
    let independent_states = []

    let democrat_EV = 0;
    let republican_EV = 0;
    let independent_EV = 0;

    // console.log(electionResult)
    electionResult.forEach((element ) => {

        element.D_Percentage = +element.D_Percentage;
        element.I_Percentage = +element.I_Percentage;
        element.R_Percentage = +element.R_Percentage;
        // element.D_Votes = +element.D_Votes;
        // element.I_Votes = +element.I_Votes;
        // element.R_Votes = +element.R_Votes;
        element.Total_EV = +element.Total_EV;

        // console.log(element)

        
        if (element.D_Percentage>element.R_Percentage && element.D_Percentage>element.I_Percentage){
            element.party = "D"
            democratic_states.push(element);
            democrat_EV += element.Total_EV;
        }
        else if (element.R_Percentage>element.D_Percentage && element.R_Percentage>element.I_Percentage){
            element.party = "R"
            republican_states.push(element);
            republican_EV += element.Total_EV;
        }
        else{
            element.party = "I"
            independent_states.push(element);
            independent_EV += element.Total_EV;
        }
        democratic_states.sort(function(a,b){
            return b.D_Percentage-a.D_Percentage;
        })
        // sort the opposite way so that its a gradient. 
        republican_states.sort(function(a,b){
            return a.R_Percentage-b.R_Percentage;
        })
        //sort the same way as dem_states. 
        independent_states.sort(function(a,b){
            return b.I_Percentage-a.I_Percentage;
        })
    
    });

    let ev_by_party = [independent_EV, democrat_EV, republican_EV, null];
    let ev_sum = independent_EV + democrat_EV + republican_EV;

    let all_ev = electionResult.reduce(function(a, b) {
        return a + b.Total_EV
    }, 0);

    var x = d3.scaleLinear()
    .range([0, self.svgWidth])
    .domain([0, all_ev])

    electionResult = independent_states.concat(democratic_states, republican_states);

    // let ev_label = this.svg.append("text").data(ev_sum);

    // ev_label
    //         .enter()
    //         .merge(ev_label)
    //         .text(function(d){
    //             return "Electoral Vote (needed to win)";
    //         })
    //         .attr("x", function(d){
    //             return self.svgWidth/2.0 - 10;
    //         })
    //         .attr("y", 10)
    //         .attr("class", "yeartext");
    // ev_label.exit().remove();
        

    // console.log(electionResult)
    let x_pos = 0;

    let chart = this.svg.selectAll('rect')
        .data(electionResult);

    chart
        .enter()
        .append("rect")
        .merge(chart)
        .transition()
        .duration(2000)
        .attr("width", function(d){
            return x(d.Total_EV);
            // return d.Total_EV;
        })
        .attr("fill",function(d){
            if (d.party == "I"){
                return "#229954"
            }
            else if (d.party=="R"){
                let intensity = (d.R_Percentage-23)
                // console.log(intensity)
                return colorScale(intensity)
                // return colorSca/le(d.R_Percentage-20)
            }
            else {
                let intensity = -1*((d.D_Percentage)/1.3)+20;
                // console.log(intensity)
                return colorScale(intensity)
            }
        })
        .attr("y", 40)
        .attr("x", function(d,i){
            x_pos += d.Total_EV
            return x(x_pos-d.Total_EV);
        })
        .attr("height", 35);
    
    chart.exit().remove()

    let votelabels = this.svg.selectAll("text")
        .data(ev_by_party)

    votelabels
        .enter()
        .append("text")
        .merge(votelabels)
        .text(function(d){
            if (d != 0 && d!= null){
                console.log(d)
                return d;
            }
            if (d== null){
                let ret_ev = Math.round(ev_sum/2.0)
                return "Electoral Vote (" + ret_ev+ " needed to win)";
            }
        })
        .transition()
        .duration(2000)
        .attr("x", function(d,i){
            let ind_pos = 0;
            if (i==0){
                ind_pos += x(d);
                return x(d)+15;
            }
            else if (i==2){
                return self.svgWidth-18;
            }
            else if (i==1){
                console.log(d)
                return ind_pos+15;
            }
            else {
                return self.svgWidth/2 -20;
            }
        })
        .attr("y", function(d){
            if (d==null){
                return 11;
            }
            else {
                return 30;
            }
        })
        .attr("class", "yeartext");

    votelabels.exit().remove();

    let center_line_ev = this.svg.selectAll('line').data(electionResult)

    center_line_ev
            .enter()
            .remove()
            .merge(center_line_ev)
            .append("line")
            .style("stroke", "slategray")
            .style("stroke-width", 1.5)
            .attr("x1", self.svgWidth/2)
            .attr("y1", 30)
            .attr("x2", self.svgWidth/2)
            .attr("y2", 85); 

    center_line_ev.exit().remove();




    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of brushSelection and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

};
