(function(){
    var instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart;
     * the classes are defined in the respective javascript files.
     */
    function init() {
        //Creating instances for each visualization
        sentimentChart = new SentimentChart();
        
        // get story data from file
        d3.tsv("data/englishfairytales.txt")
            .then(function(fairyTales) {
                let newarr = []
                // put all words into an array.
                for (let i=0; i<fairyTales.length; i++ ){
                    if (fairyTales[i]['ENGLISH FAIRY TALES'] != ""){
                        newarr.push(fairyTales[i]['ENGLISH FAIRY TALES']);
                    }
                }

                let tomTitTot = []
                let theThreeSillies = []
                let theRoseTree = []
                let theOldWomanAndHerPig = []
                let howJackWentToSeekHisFortune = []
                let mrVinegar = []

                // split into story arrays 
                for (let i=0; i<newarr.length; i++){
                    if (i >=65 && i< 152){
                        tomTitTot.push(newarr[i])
                    }
                    else if (i>=152 && i< 163){
                        theThreeSillies.push(newarr[i])

                    }
                    else if (i>=163 && i< 204){
                        theRoseTree.push(newarr[i])
                    }
                    else if (i>=204 && i < 219){
                        theOldWomanAndHerPig.push(newarr[i])
                    }
                    else if (i>= 219 && i< 258){
                        howJackWentToSeekHisFortune.push(newarr[i])
                    }
                    else if (i>=258 && i< 276){
                        mrVinegar.push(newarr[i])
                    }
                }

               fairyTales = [
                    {title: tomTitTot[0], content: tomTitTot}, 
                    {title: theThreeSillies[0], content: theThreeSillies}, 
                    {title: theRoseTree[0], content: theRoseTree}, 
                    {title: theOldWomanAndHerPig[0], content: theOldWomanAndHerPig}, 
                    {title: howJackWentToSeekHisFortune[0], content: howJackWentToSeekHisFortune}, 
                    {title: mrVinegar[0], content: mrVinegar}
               ];

                //pass the instances of all the charts that update on selection change in YearChart
                var selectionChart = new SelectionChart(sentimentChart, fairyTales);
                selectionChart.update();


            });
    }

    // THE Rest of the code in this file is copied from assignment 2 template code. 
    /**
     *
     * @constructor
     */
    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    /**
     *
     * @returns {Main singleton class |*}
     */
    Main.getInstance = function(){
        var self = this
        if(self.instance == null){
            self.instance = new Main();

            //called only once when the class is initialized
            init();
        }
        return instance;
    }

    Main.getInstance();
})();