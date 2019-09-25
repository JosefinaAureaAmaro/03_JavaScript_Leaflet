// Step 1: USGS API
// ===================================
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson" + 
                    "&starttime=2018-08-01&endtime=2018-08-31&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


// Step 2: Gather data into d3 JSON format 
// ===================================
var dataLength, myMap, longLat;

d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
    console.log(`properties: ${Object.keys(data)}`); 
    console.log(`mag: ${data.features[0].properties.mag}`);

    var test = data.features[0].geometry.coordinates.slice(0,2);

    console.log(`coordinates: ${test}`); 
    dataLength = data.features.length;
 
  createFeatures(data.features);
  createMarkers(data);
  });


// Step 3: Assign function to coordinate Circle Marker size 
// ===================================

// Function to determine marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 5;
}


// Step 4: Create Circle Markers & Pop-Up based on Coordinates 
// ===================================

/** ERROR IS HERE */
function createFeatures(data) {

  function onEachFeature(data, layer) {

    // Loop through coordinates create city markers
    for (var i = 0; i < dataLength; i++) {
      // create an array to extract long & lat from coordinates
      longLat = data.features[i].geometry.coordinates.slice(0,2);
    

      // Define arrays to hold created city and state markers
      var earthquakeMarkers = [];

      // Setting the marker radius for the city by passing magnitude into the markerSize function
      earthquakeMarkers.push(
        L.circle(longLat, {
          stroke: false,
          fillOpacity: 0.75,
          color: "purple",
          fillColor: "purple",
          radius: markerSize(data.features[i].properties.mag)
        })
      );
    }

    layer.bindPopup("<h3>" + data.features.properties.place +
    "</h3><hr><p>" + new Date(data.features.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the "data" object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(data, {
    onEachFeature: onEachFeature
    });
  
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


// Step 5: Create Map based on layers and features
// ===================================
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

  
  