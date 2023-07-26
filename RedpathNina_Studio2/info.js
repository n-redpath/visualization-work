
console.log("console message from script")
var ride0 = {
    id: 1234,
    name: "kingda kaa",
    price: 13.00,
    open: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"], 
    childFriendly: false

}

var ride1 = {
    id: 2345,
    name: "spinny teacup",
    price: 8.00,
    open: ["Tuesday", "Thursday", "Friday", "Saturday", "Sunday"], 
    childFriendly: true

}

var ride2 = {
    id: 3456,
    name: "haunted house",
    price: 15.00,
    open: ["Thursday", "Friday", "Saturday", "Sunday"], 
    childFriendly: false

}

var rides = [ride0, ride1, ride2];


console.log(ride0.name)
console.log(ride2.open)
console.log(ride2.open[0])
console.log(ride2.price/2.0)

doublePrice(rides);

function doublePrice(rideArray) {
    for (var i=0; i<rideArray.length; i++){
        if (i!=1){
        rideArray[i].price = rideArray[i].price*2.0;
        }
    }
console.log("completed function")
console.log(rideArray)
}

debugAmusementRides(rides);
function debugAmusementRides(rideArray){
    for (var i=0; i<rideArray.length; i++){
        var printVar = rideArray[i].name + " $" + rideArray[i].price;
        console.log(printVar);
    }
}

displayRides(rides)
function displayRides(rideArray){
    for (var i=0; i<rideArray.length; i++){
        var p = document.createElement("p");
        var printVar = document.createTextNode(rideArray[i].name + " $" + rideArray[i].price);
        p.appendChild(printVar);
        document.getElementById("ride-content").appendChild(p);
    }
}

