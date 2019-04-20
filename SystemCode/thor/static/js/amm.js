// Stored retrieved polylines for the session
var localCache = {
    remove: function (url) {
        sessionStorage.removeItem(url);
    },
    exist: function (url) {
        return sessionStorage.getItem(url) != null;
    },
    get: function (url) {
    	console.log("retrieving data from cache");
        return sessionStorage.getItem(url);
    },
    set: function (url, cachedData) {
        localCache.remove(url);
        sessionStorage.setItem(url, cachedData);
    }
};

// get query string from url
const URL_QUERY_STRING = window.location.href.split("?")[1] || window.location.search.slice(1);

// Get all the marker information from url string query
function getMarkerInfo() {
	var unformattedData = new URLSearchParams(URL_QUERY_STRING).getAll("marker");
	var obj = [];

	unformattedData.forEach((udElement) => {
		var temp = new Object();
		var splitData = udElement.split("!");

		splitData.forEach((nameValuePair) => {
			nameValuePair = nameValuePair.split(":").filter(i=>i);
			if(nameValuePair.length < 2) {
				console.warn("ERROR: Malformed data? Skipping...");
				return;
			}
			temp[nameValuePair[0]] = nameValuePair[1];
		});
		obj.push(temp);
	});
	return obj;
}

function getParameterByName(name) {
	return new URLSearchParams(URL_QUERY_STRING).get(name);
}

function generateMiniMap() {
	//Retrieve all parameters required by minimap
	const mWidth = parseFloat(getParameterByName("mWidth")) || "100%";
	const mHeight = parseFloat(getParameterByName("mHeight")) || "100%";
	const zoom = getParameterByName("zoomLevl") || "17";
	const popupWidth = getParameterByName("popupWidth") || "200";
	const popupHeight = getParameterByName("popupHeight");
	const layerChosen = getParameterByName("design") || "default";
	const markerData = getMarkerInfo();

	// Reject if map width and height values is incorrect/missing
	/*if(mWidth=="" || IsNumeric(mWidth) == false || parseFloat(mWidth)<190 || mHeight=="" || IsNumeric(mHeight) == false || parseFloat(mHeight)<195){
		alert("Your width or height parameters are not acceptable. (Min 200 x 200 px)");
		return;
	}*/
	//console.log(parseFloat(mWidth));
	if(mWidth<190 || mHeight<195) {
		alert("Your width or height parameters are not acceptable. (Min 200 x 200 px)");
		return;
	}

	// Setting Width and Height of Mini Map
	document.getElementById("mapdiv").style.width = mWidth;
	document.getElementById("mapdiv").style.height = mHeight;
	
	// Ready to fill the map with marker(s)
	propagateMap(mWidth, mHeight, zoom, popupWidth, popupHeight, layerChosen, markerData);
}

var routingUtil = {
	decodePolyline: (encoded, precision) => {
        precision = Math.pow(10, -precision);
        var len = encoded.length,
            index = 0,
            lat = 0,
            lng = 0,
            array = [];
        while (index < len) {
            var b, shift = 0,
                result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5
            } while (b >= 0x20);
            var dlat = result & 1 ? ~(result >> 1) : result >> 1;
            lat += dlat;
            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5
            } while (b >= 0x20);
            var dlng = result & 1 ? ~(result >> 1) : result >> 1;
            lng += dlng;
            array.push([lat * precision, lng * precision])
        }
        return array
    },
	generateToken: () => {
		return new Promise((resolve, reject) => {
			var form = new FormData();
			form.append("email", "e0384939@u.nus.edu");
			form.append("password", "1qazxsw2");
			var request = new XMLHttpRequest();
			request.open("POST", "https://developers.onemap.sg/privateapi/auth/post/getToken");
			request.responseType = 'json';
			request.send(form);
			request.onload = () => resolve(request.response);
			request.onerror = () => reject(request.statusText);
		})
	},
	getPolyline: async (rType, rStart, rDest) => {
		var token = (await routingUtil.generateToken()).access_token;
		// token = token.access_token;
		var polyLine = [];
		switch(rType) {
			case "TRANSIT":
			case "BUS":
			case "RAIL":
			case "pt":
				const date = moment().format("YYYY-MM-DD");
				const time = "12:00:00";
				
				var requestURL = `https://developers.onemap.sg/privateapi/routingsvc/route?start=${rStart}&end=${rDest}&routeType=pt&token=${token}&date=${date}&time=${time}&mode=${rType}&numItineraries=1`;
				if(localCache.exist(requestURL)) {
					return JSON.parse(localCache.get(requestURL));
				}
				else {
					var request = new XMLHttpRequest();
					request.responseType = 'json';
					request.open("GET", requestURL);
					request.send();
					return new Promise((resolve, reject) => {
						request.onload = () => {
							try {
								request.response.plan.itineraries[0].legs.forEach(async function(leg) {
									polyLine.push(routingUtil.decodePolyline(leg.legGeometry.points, 5));
								});
								localCache.set(requestURL, JSON.stringify(polyLine));
								console.log("SUCCESS: Returning promise");
								resolve(polyLine);
							} catch(e) {
								reject(new Error(`${request.response.error.split(":")[1]}. Status code: ${request.response.error.split(":")[0]}`));
							}
						};
						request.onerror = () => {
							reject(new Error("Failed to connect to API endpoint"));
						};
					}).catch(function(error) {
						document.getElementById("info").innerHTML = `<p>The server is busy, try again later</p>`;
					});	
				}
    			break;
    		case "walk":
    		case "drive":
    		case "cycle":
    			var requestURL = `https://developers.onemap.sg/privateapi/routingsvc/route?start=${rStart}&end=${rDest}&routeType=${rType}&token=${token}`;
    			if(localCache.exist(requestURL)) {
					return JSON.parse(localCache.get(requestURL));
				}
				else {
					var request = new XMLHttpRequest();
    				request.responseType = 'json';
					request.open("GET", requestURL);
					request.send();
					return new Promise((resolve, reject) => {
						request.onload = () => {
							try {
								polyLine.push(routingUtil.decodePolyline(request.response.route_geometry, 5));
								localCache.set(requestURL, JSON.stringify(polyLine));
								console.log("SUCCESS: Returning promise");
								resolve(polyLine);
							} catch(e) {
								reject(new Error(`${request.response.error.split(":")[1]}. Status code: ${request.response.error.split(":")[0]}`));
							}
						}
						request.onerror = () => {
							reject(new Error("Failed to connect to API endpoint"));
						}
					}).catch(function(error) {
						document.getElementById("info").innerHTML = "<p>The server is busy, try again later</p>";
					});
				}
    			break;
    	}
    	//return polyLine;	
	}
}

function propagateMap(mWidth, mHeight, zoom, popupWidth, popupHeight, layerChosen, markerData) {
	// Render only the map if NO markers added, additional check below
	if(markerData.length <= 0) {
		var center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
		var map = L.map('mapdiv',{fullscreenControl: true}).setView([center.x, center.y], zoom);
	}
	else {
		var temp = markerData[0]["latLng"].split(",");
		var map = L.map("mapdiv",{fullscreenControl: true}).setView([parseFloat(temp[0]), parseFloat(temp[1])], zoom);
		// L.control.custom({
		// 	position: 'bottomright',
		// 	content : '<div class="input-group"><span class="input-group-btn"><a href="https://onemap.sg/main/v2/?lat='+temp[0]+'&lng='+temp[1]+'" target="_blank"><button class="btn btn-light btn-sm" type="button">View Larger Map</button></a> </span></div>',
		// 	classes : '',
		// 	style   :{
		// 		margin: '5px 20px',
		// 		padding: '0px',
		// 	},
		// }).addTo(map);
	}

	//var basemap;
	var basemap = L.tileLayer(`https://maps-{s}.onemap.sg/v3/${layerChosen}/{z}/{x}/{y}.png`, {
		attribution: "Map data &copy contributors, <a href='https://SLA.gov.sg' target='_blank' rel='noopener noreferrer'>Singapore Land Authority</a>",
		maxZoom: 19,
		minZoom: 11
	});
	basemap.addTo(map);
	attribution = map.attributionControl;
	attribution.setPrefix("<img src='img/logo.png' style='height:16px;width:16px;'/>");

	// Setting the bounds of Singapore
	map.setMaxBounds([[1.56073, 104.11475],[1.16, 103.502]]);

	// If NO markers, do not continue pass here
	if(markerData.length === 0) {// <= 0) {
		return;
	}

	//
	var latLngList = [];
	markerData.forEach(async (data) => {
		var tempForSplit = data["latLng"].split(",");

		var markerLocation = new L.LatLng(parseFloat(tempForSplit[0]), parseFloat(tempForSplit[1]));
		latLngList.push(markerLocation);

		//var iconMarker = data["icon"] != undefined ? data["icon"].split("fa-")[1] : "circle";
		var markerAppearance = L.AwesomeMarkers.icon({
			icon: data["icon"] || "circle",//iconMarker,
			prefix: "fa",
			markerColor: data["colour"] || "red"
		});
		var marker = new L.Marker(markerLocation, {icon: markerAppearance});
		/*var marker = new L.Marker(markerLocation, {
			interactive: data["iwt"] != undefined,
			icon: markerAppearance
		});*/

		var viewLargerMapLink = `<a href='https://onemap.sg/main/v2/?lat=${markerLocation.lat}&lng=${markerLocation.lng}' target='_blank' rel='noopener noreferrer'>View larger map</a>`;
		if(data["iwt"] != undefined) {
			var customOptions = {
				"minWidth": popupWidth,
				"maxWidth": popupWidth,
				"maxHeight": popupHeight
			}
			// Need to replace spaces with "+" for Base64 decoding
			marker.bindPopup(window.atob(data["iwt"].replace(/\s/g, "+")) + viewLargerMapLink, customOptions);
		}
		else {
			marker.bindPopup(viewLargerMapLink);
		}

		// async marker to marker routing
		if(data["rType"] != undefined && data["rDest"] != undefined) {
			async function run() {
				console.log("Adding polylines to map...");
				var result = await routingUtil.getPolyline(data["rType"], data["latLng"], data["rDest"]) || [];
				result.forEach(async function(coord) {
					var validateColour = (value) => {
						if(value==="lightred")
							return "LightCoral";
						else if(value==="beige")
							return "NavajoWhite";
						else if(value==="darkpurple")
							return "MidnightBlue";
						else
							return value;
					}
					var instructs = `https://onemap.sg/main/v2/journeyplanner?start=${data["latLng"]}&dest=${data["rDest"]}&mode=${data["rType"]}&date=${moment().format("YYYY-MM-DD")}&time=12:00:00&index=0`;
					L.polyline(coord, {
						color: validateColour(data["colour"])
					}).bindPopup(`<p>Route type: ${data["rType"].toLowerCase()}</p><a href="${instructs}" target="_blank" rel="noopener noreferrer">View route instructions</a>`).addTo(map);
				});
			}
			run();
		};

		map.addLayer(marker);
		// Only 1 popup can appear
		//marker.openPopup();
	})

	// Auto adjust zoom if more than 1 marker
	if(latLngList.length > 1) {
		// This overrides manual zoom levels
		// Add paddings to prevent markers being too close to edge of map
		map.fitBounds(latLngList, {padding: [50, 50]});
	}
	// else {
	// 	// Move camera to marker
	// 	map.panTo(L.polygon(markerList).getBounds().getCenter());
	// }
}

/*function IsNumeric(val) {
	return Number(parseFloat(val))==val;
}*/

generateMiniMap();