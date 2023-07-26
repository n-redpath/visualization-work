/**
 * Constructor for the story selection
 * The following code structure was learned from the template code in assignment 2 
 * the initialization of the selection chart and the prototype initialization were copied and then edited 
 * to suit this project. 
 *
 * @param sentimentChart instance of ElectoralVoteChart
 * @param fairyTales array of fairy tales
 */
 function SelectionChart(sentimentChart, fairyTales) {
    var self = this;

    self.sentimentChart = sentimentChart;
    self.fairyTales = fairyTales;
    self.init();
};


SelectionChart.prototype.init = function(){

// this code is from the assignment 2 template
    var self = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var selectionDiv = d3.select("#selection-chart").classed("fullView", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = selectionDiv.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 150;
    
    // create svg
    self.svg = selectionDiv.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

};

/**
 * Creates a chart with circles representing each fairy tale, populates sentiment charts
 */
SelectionChart.prototype.update = function(){
    var self = this;

    self.fairyTales.forEach(function(d) {

       self.svg.selectAll("image")
        .data(self.fairyTales)
        .enter()
        .append("svg:image")
        .transition()
        .duration(1000)
        .attr("xlink:href", "../test_files/book.png")
        .attr("x", function(d,i){
            return 40+ i*self.svgWidth/6;
        })
    	.attr("y", 0)
        .attr("width", "5%")
        .attr("height", "35%");

        self.svg.selectAll("text")
        .data(self.fairyTales)
        .enter()
        .append("text")
        .text(function(d){
            return d.title;
        })
        .transition()
        .duration(1000)
        .attr("x", function(d,i){
            return 65+ i*self.svgWidth/6;
        })
        .attr("text-anchor", "middle")
        .attr("y", 75)
        .attr("font-size", "8px");


        self.svg.selectAll("image")
        .on("click", function(d, i){  
            
            // highlight the clicked book 
            d3.select(".currentStory")
            .attr("class", function(d){
                return "";
            })
            d3.select(this)
            .attr("class", "currentStory")
            .transition()
            .duration(2000);






            let new_content = "";
            // the following 5 lines of code were taken from https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
            for (let j=1; j< i.content.length; j++){
                            //clean up punctuation
                new_content += i.content[j].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                            // put all words into one big array (can be done here or in main)
                new_content += " ";
            }

            new_content = new_content.split(" ");


            //iterate through and put into sentiment arrays. 
            g_words = []
            b_words = []
            all_scored_words = []

            var labels = [];
            var negations = ["cant",
            "can't",
            "dont",
            "don't",
            "doesnt",
            "doesn't",
            "not",
            "non",
            "wont",
            "won't",
            "isnt",
            "isn't"];

            //GETTING GOOD AND BAD WORD LISTS
            // THiS CODE IS TAKEN FROM https://stackoverflow.com/questions/14540248/how-to-get-an-array-javascript-of-json-file
            $.getJSON('../test_files/labels.json', function (json) {
                for (var key in json) {
                    if (json.hasOwnProperty(key)) {
                        labels.push({
                            word: key,
                            score: json[key],
                        });            
                    }
                }
                // ACTUAL SENTIMENT ANALYSIS> 
                for (let currentWord=0; currentWord<new_content.length; currentWord ++){
                    
                    // this maps through all the words in the labels.json. 
                    let wordInList = $.map(labels, function(elem, index) {
                        // if the word is in the labels file, 
                        if (elem.word == new_content[currentWord]) { 
                            //  score it
                            let element = {word: new_content[currentWord], score: elem.score, index: currentWord}
                            new_content[currentWord] = element;

                            // check if word is being negated. (the word before it exists in negations.)
                            if (currentWord>0 && negations.indexOf(new_content[currentWord-1]) > -1){
                                element.score = -element.score;                                
                            }

                            if (element.score>0){
                                g_words.push(element);
                                all_scored_words.push(element);
                                return true;
                            }
                            else if (element.score <0){
                                b_words.push(element);
                                all_scored_words.push(element);
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    });
                }

                   // call  sentiment chart of sentiment arrays. 
                    let fairyTale = {
                        title: i.title,
                        content: all_scored_words,
                        good_words: g_words,
                        bad_words: b_words, 
                        // neutral_words: n_words,
                    }
                    self.sentimentChart.update(fairyTale);

                });

        })


    });
};
