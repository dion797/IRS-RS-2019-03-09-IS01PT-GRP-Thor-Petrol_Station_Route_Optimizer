// *********************************** Algorithm ***********************************

// Waypoints = ... Need to connect to form
// Stations = ... need to get input from clips to decide which array to use for Stations taken from stationdata.js 

// *********************************** Main ***********************************
var DisArray = [];
var Rank1 = [];
var Rank2 = [];
var Rank3 = [];
var Rank4 = [];
var Rank5 = [];
var resultWayPoint = [];


function myFunction(data) {

    sleep(1000);
    data2 = vPetrolBrand;
	console.log(data2);
	var c = data.toString()
	if(c.localeCompare("SPC") === 0) {
	    console.log("SPC");
	    OptiRoute(Waypoints, SPC);
	}
	if(c.localeCompare("Esso") === 0) {
	    console.log("Esso");
	    OptiRoute(Waypoints, Esso);
	}
	if(c.localeCompare("Shell") === 0) {
	    console.log("Shell");
	    OptiRoute(Waypoints, Shell);
	}
	if(c.localeCompare("Caltex") === 0) {
	    console.log("Caltex");
	    OptiRoute(Waypoints, Caltex);
	}

	//OptiRoute(Waypoints, Stations);
}

// *********************************** Algorithm ***********************************
// Waypoints is an array of lat long
// Stations is an array of lat long

function OptiRoute(Waypoints, Stations) {
    DisArray = [];
    Rank1 = [];
    Rank2 = [];
    Rank3 = [];
    Rank4 = [];
    Rank5 = [];
    resultWayPoint = [];


	for(var i=0; i<Waypoints.length-1; i++) {
		for(var j=0; j<Stations.length; j++) {
			  TotalDist = distance(Waypoints[i], Stations[j])+ distance(Stations[j], Waypoints[i+1]); 
			for(var k=0; k<i; k++) {
				TotalDist += distance(Waypoints[k], Waypoints[k+1]);
			}
			for(var l=i+1; l<Waypoints.length-1; l++) {
				TotalDist += distance(Waypoints[l], Waypoints[l+1]);
			}						
			DisArray.push({Dist:TotalDist, ivalue:i, jvalue:j})
		}	
	}
	// Sorting by shortest distance
	DisArray.sort(function(a, b) {
		return a.Dist - b.Dist;
	});
	
	// For Rank 1
	for(var i=0; i<DisArray[0].ivalue + 1; i++) {
		Rank1.push({lat:Waypoints[i].x, long:Waypoints[i].y})
	}
	Rank1.push({lat:Stations[DisArray[0].jvalue].x, long:Stations[DisArray[0].jvalue].y})
	for(var i=DisArray[0].ivalue + 1; i<Waypoints.length; i++) {
		Rank1.push({lat:Waypoints[i].x, long:Waypoints[i].y})
	}
	
	// For Rank 2
	for(var i=0; i<DisArray[1].ivalue + 1; i++) {
		Rank2.push({lat:Waypoints[i].x, long:Waypoints[i].y})
	}
	Rank2.push({lat:Stations[DisArray[1].jvalue].x, long:Stations[DisArray[1].jvalue].y})
	for(var i=DisArray[1].ivalue + 1; i<Waypoints.length; i++) {
		Rank2.push({lat:Waypoints[i].x, long:Waypoints[i].y})
	}

	// For Rank 3
	for(var i=0; i<DisArray[2].ivalue + 1; i++) {
		Rank3.push({lat:Waypoints[i].x, long:Waypoints[i].y})
	}
	Rank3.push({lat:Stations[DisArray[2].jvalue].x, long:Stations[DisArray[2].jvalue].y})
	for(var i=DisArray[2].ivalue + 1; i<Waypoints.length; i++) {
		Rank3.push({lat:Waypoints[i].x, long:Waypoints[i].y})
	}

	// Printing out
    localStorage.removeItem("resultWayPoint");

	Results = "Rank1 - Total Dist: " + DisArray[0].Dist + "<br>"
	document.getElementById('status').innerHTML += Results;
	for(var i=0; i<Rank1.length; i++) {
		Results = "Lat: " + Rank1[i].lat + " Long: " + Rank1[i].long + " <br>"
		resultWayPoint.push({x:Rank1[i].lat+"", y:Rank1[i].long+""})
		document.getElementById('status').innerHTML += Results;
	}
	localStorage.setItem("resultWayPoint", JSON.stringify(resultWayPoint));

	Results = "Rank2 - Total Dist: " + DisArray[1].Dist + "<br>"
	document.getElementById('status').innerHTML += Results;
	for(var i=0; i<Rank2.length; i++) {
		Results = "Lat: " + Rank2[i].lat + " Long: " + Rank2[i].long + " <br>"
		document.getElementById('status').innerHTML += Results;
	}

	Results = "Rank3 - Total Dist: " + DisArray[2].Dist + "<br>"
	document.getElementById('status').innerHTML += Results;
	for(var i=0; i<Rank3.length; i++) {
		Results = "Lat: " + Rank3[i].lat + " Long: " + Rank3[i].long + " <br>"
		document.getElementById('status').innerHTML += Results;
	}
}




function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a = 
	  Math.sin(dLat/2) * Math.sin(dLat/2) +
	  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	  Math.sin(dLon/2) * Math.sin(dLon/2)
	  ; 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
  }
  
function deg2rad(deg) {
	return deg * (Math.PI/180)
}


function distance(p1, p2) {
	if ((p1.x == p2.x) && (p1.y == p2.y)) {
		return 0;
	}
	else {
		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(p1.x-p2.x);  // deg2rad below
		var dLon = deg2rad(p2.y-p1.y); 
		var a = 
		  Math.sin(dLat/2) * Math.sin(dLat/2) +
		  Math.cos(deg2rad(p1.x)) * Math.cos(deg2rad(p2.x)) * 
		  Math.sin(dLon/2) * Math.sin(dLon/2)
		  ; 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var dist = R * c; // Distance in km
		return dist;
	}
}

function getSoln(){
    window.location = './b'
}
