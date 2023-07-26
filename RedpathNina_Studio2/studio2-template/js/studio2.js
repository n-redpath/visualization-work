
// Global variable with 60 attractions (JSON format)
// console.log(attractionData);

dataFiltering(attractionData);

function dataFiltering(attractions) {

	data = []

	attractions = attractions.sort(function(a, b){
		return b.Visitors - a.Visitors;
	})

	for (var i=0;i<5;i++){
		data[i] = attractions[i];
	}
	renderBarChart(data)

	/* **************************************************
	 *
	 * ADD YOUR CODE HERE (ARRAY/DATA MANIPULATION)
	 *
	 * CALL THE FOLLOWING FUNCTION TO RENDER THE BAR-CHART:
	 *
	 *
	 * - 'data' must be an array of JSON objects
	 * - the max. length of 'data' is 5
	 *
	 * **************************************************/

}

function dataManipulation(){
	var attractions = attractionData;
	// next two lines copied from studio 2 document. 
	var selectBox = document.getElementById("attraction-category");
	var selectedValue = selectBox.options[selectBox.selectedIndex].value;
	console.log(selectedValue)

	if (selectedValue == "all"){
		dataFiltering(attractionData);
	}
	else {
		data = []
		for (var i = 0; i<attractions.length; i++){
			if (attractions[i].Category == selectedValue){
				data.push(attractions[i]);
			}
		}
		dataFiltering(data)

	}

}