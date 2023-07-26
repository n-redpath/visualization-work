let marriages = [
[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
[0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0],
[0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0],
[0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0],
[0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0],
[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
[1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
[0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1],
[0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
[0,0,0,1,1,0,0,0,0,0,1,0,1,0,0,0],
[0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0]];

marriageVals = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]


let businessTies = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,1,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0],
    [0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,1,0,0,0,1,0,0,0,0,0],
    [0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0]];


businessVals = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    for (let i=0; i<marriages.length; i++){
        for (let j=0; j<marriages[0].length; j++){
            if (marriages[i][j]==1){
                marriageVals[i] += 1;
            }
            if (businessTies[i][j] == 1){
                businessVals[i] += 1;
            }
        }
    }


let svgWidth = 500;
let svgHeight = 500;
    
let element = d3.select('#grid').append('svg')
    .attr("width", svgWidth).attr("height", svgHeight);

families_arr = [];
d3.csv("florentine-family-attributes.csv")
    .then(function(family) {

        for (let i=0; i<family.length; i++){
        //pass the instances of all the charts that update on selection change in YearChart

        let index = families_arr.length;
        // let num_marriages = lodash.sum(marriages[index]);

        
        for (col = 0; col<businessTies[index].length; col++){
            if (businessTies[col]==1){
                relation += 1;
            }
            if (marriages[col]==1){
                num_marriages += 1;
            }
        }

        let new_family = {
            name: family[i].Family, 
            index: index,
            allRelations: marriageVals[index] + businessVals[index],
            businessTies: businessVals[index],
            marriages: marriageVals[index],
            businessValues: businessTies[index],
            marriageValues: marriages[index],
            numberPriorates: family[i].Priorates,
            wealth: family[i].Wealth,
        }

        families_arr.push(new_family)
    }

    updateVis(families_arr);

    });
         


function updateVis(families){
    element.selectAll("path").remove();
    element.selectAll('text').remove();
    element.selectAll("g").remove();



// let groups = element.selectAll('path').data(families);



for (let i=0; i< families.length; i++){
    let group = element.append("g");
    let groups = group.selectAll('path').data(families);

    let hor_names =group
        .append("text")
        .text(function(){
            return families[i].name;
        })
        .transition()
        .duration(200)
        .attr("x", 0)
        .attr("y", i*(svgHeight)/20+(svgHeight/5+svgHeight/100));

    let vert_names = group
        .append("text")
        .text(function(){
            return families[i].name;
        })
        .attr("x", -svgHeight/6.25)
        .attr("y", i*(svgHeight)/20+(svgHeight/5+svgHeight/50))
        .attr("transform", "rotate(-90)");
            
    var cellHeight = svgHeight/25, cellWidth = svgHeight/25, cellPadding = svgHeight/100;

    let firstTriangles = groups.enter().append("path")
        .attr("d", function(d, k) {
        var x = (cellWidth + cellPadding) * i + 6*cellWidth - cellPadding;

        var y = k*25 + 110;

        return 'M ' + x +' '+ y + ' l ' + -cellWidth + ' 0 l 0 ' + -cellHeight + ' z';
        })
        .attr("class", function(d, k){
            return "row-"+k +" col-"+i +" non";
        })
        .attr("fill", function(d, k){
            if (d.marriageValues[i]==0 && d.businessValues[i] ==0){
                return "lightgrey";
            }
            else if (d.marriageValues[i]==1 && d.businessValues[i] ==0){
                return "salmon"
            }
            else if (d.marriageValues[i]==0 && d.businessValues[i] ==1){
                return "#c9a0dc";
            }
            else {
                return "salmon";
            }
        }
        ).on('mouseover', function(d,l, k){
           
            d3.selectAll('.col-'+ i ).classed("highlighted", true)
            d3.selectAll('.col-'+ i ).classed('non', false);
            d3.selectAll('.non').classed('seethru', true);

        })
        .on('mouseout', function(){
            d3.selectAll('.col-'+ i).classed("highlighted", false);
            d3.selectAll('.non').classed('seethru', false);
            d3.selectAll('.col-'+i).classed('non', true);
        });


    let secondTriangles = groups.enter().append("path")
        .attr("d", function(d, k) {

            var x = (cellWidth + cellPadding) * i+ 5*cellWidth-cellPadding;
            var y = k*25 + 5*cellHeight-2*cellPadding;

            return 'M ' + x +' '+ y + ' l ' + cellWidth + ' 0 l 0 ' + cellHeight + ' z';
        })
        .attr("class", function(d, k){
            return "row-"+k +" col-"+i + " non";
        })
        .attr("fill", function(d){
            // if marrianges AND business ties are zero, return grey
            if (d.marriageValues[i]==0 && d.businessValues[i] ==0){
                return "lightgrey";
            }
            else if (d.marriageValues[i]==1 && d.businessValues[i] ==0){
                return "salmon"
            }
            else if (d.marriageValues[i]==0 && d.businessValues[i] ==1){
                return "#c9a0dc";
            }
            else {
                // return purple on the bottom. 
                return "#c9a0dc";
            }
        }).on('mouseover', function(d,l, k){
           
            d3.selectAll('.col-'+ i ).classed("highlighted", true)
            d3.selectAll('.col-'+ i ).classed('non', false);
            d3.selectAll('.non').classed('seethru', true);

        })
        .on('mouseout', function(){
            d3.selectAll('.col-'+ i).classed("highlighted", false);
            d3.selectAll('.non').classed('seethru', false);
            d3.selectAll('.col-'+i).classed('non', true);
        });


        
}

}



document.getElementById("sort").addEventListener("change", function(event){
    let sort = event.target.value;
// sort functino taken from stack overflow: 
// https://stackoverflow.com/questions/2466356/sorting-objects-by-property-values
    if (sort == 'busTies'){
        families_arr.sort((a, b) => (b.businessTies > a.businessTies) ? 1 : -1)
    }

    if (sort == 'marTies'){
        families_arr.sort((a, b) => (b.marriages > a.marriages) ? 1 : -1)
    }

    if (sort == 'numRelations'){
        families_arr.sort((a, b) => (b.allRelations > a.allRelations) ? 1 : -1)
    }
    if (sort == 'wealth'){
        families_arr.sort((a, b) => (b.wealth > a.wealth) ? 1 : -1)
    }

    if (sort == 'numSeats'){
        families_arr.sort((a, b) => (b.numberPriorates > a.numberPriorates) ? 1 : -1)
    }
    if (sort == 'default'){
        families_arr.sort((a, b) => (a.name > b.name) ? 1 : -1)
    }
    console.log(families_arr);
    updateVis(families_arr);
});

