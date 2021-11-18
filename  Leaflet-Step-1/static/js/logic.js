const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

function createMap(earthquakes) {

    // create base map
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // create baseMaps object to hold lightMap layer
    var baseMap = {
        "Street Map": streetmap
    };

    // create an overlayMaps object
    var overlayMaps = {
        "Earthquakes": earthquakes
      };
    
      // create the map object
      var map = L.map('map', {
        center: [34.0522, -118.2437],
        zoom: 2,
        layers: [streetmap, earthquakes]
      });
    
    // create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMap, overlayMaps, {
        collapse: false
    }).addTo(map);
}

function createMarkers(response) {

    // pull the earthquakes from the data
    var features = response.features;

    var earthquakeMarkers = []

    // loop through earthquakes and make array of markers
    for (var i = 0; i < features.length; i++) {

        var earthquake = features[i];

        var earthquakeMarker = L.marker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]])
            .bindPopup("<h3>URL: " + earthquake.properties.url + 
            "</h3><h3>Time: " + earthquake.properties.time + "</h3>" +
            "</h3><h3>Title: " + earthquake.properties.title + "</h3>" +
            "</h3><h3>Place: " + earthquake.properties.place + "</h3>" 
            );

        earthquakeMarkers.push(earthquakeMarker);
    }
    // Create layer group from the markers array, and pass it to the createMap function.
    createMap(L.layerGroup(earthquakeMarkers));
}


// Perform API call
d3.json(url).then(createMarkers);

d3.json(url).then(data => {
    console.log(data);
});
