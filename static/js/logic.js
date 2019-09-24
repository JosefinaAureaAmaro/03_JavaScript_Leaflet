var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson" + 
                    "&starttime=2018-08-01&endtime=2018-08-31&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


// Step 1: Gather Data                   
// Perform a GET request to the query URL
var Data, eqmag, data; 

d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  Data = data.features;
  createFeatures(data.features);
  createMarkers(data);
  });

  function createMarkers(data) {
  for (var i = 0; i < data.length; i++) {
    L.circle(data.point.coordinates, {
        fillOpacity: 0.75,
        color: "white",
        fillColor: "purple",
    // Setting our circle's radius equal to the output of our markerSize function
    // This will make our marker's size proportionate to its magnitude
        radius: eqmag * 10
    }).bindPopup("<h3>" + "<b> Location: </b>" + data.feature.properties.place +
    "</h3><hr><p>" + "Magnitude:" + parseFloat(data.feature.properties.mag).toFixed(3) + "</p>").addTo(myMap); 
    };
  }
  


  function createFeatures(earthquakeData) {
    // Step 2: Iterate through GeoJSON to visualize data
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: createMarkers    
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

   // Step 3: Assign layers to the Map 
  function createMap(earthquakes) {
  
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}`, {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}`, {
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
    var myMap = L.map("map", {
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

  
  