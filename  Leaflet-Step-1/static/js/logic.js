const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// function selects a color for the earthquake depth
function getColor(d) {
    return d >= 90 ? '#ff5f65' :
           d >= 70  ? '#fca35d' :
           d >= 50  ? '#fdb72a' :
           d >= 30  ? '#f7db11' :
           d >= 10   ? '#ddf400' :
           '#a4f600' ;
           
}

function createMap(earthquakes) {

    // create base map
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // create baseMaps object to hold layer
    var baseMap = {
        "Street Map": streetmap
    };

    // create an overlayMaps object
    var overlayMaps = {
        "Earthquakes": earthquakes
    };
    
    // create the map object
    var map = L.map('map', {
        center: [37.6872, -97.3301],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });
    
    // create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMap, overlayMaps, {
        collapse: false,
    }).addTo(map);

     //LEGEND____________________________________________
     var legend = L.control({position: 'bottomright'});

     legend.onAdd = function () {
 
         var div = L.DomUtil.create('div', 'info legend'),
             grades = [-10, 10, 30, 50, 70, 90],
             labels = [];
 
         // loop through our density intervals and generate a label with a colored square for each interval
         for (var i = 0; i < grades.length; i++) {
             div.innerHTML +=
                 '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                 grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
         }
         return div;
     };
 
     legend.addTo(map);
}

function createMarkers(response) {

    // pull the earthquakes from the data
    var features = response.features;

    var earthquakeMarkers = [];

    // loop through earthquakes and make array of markers
    for (var i = 0; i < features.length; i++) {

        var earthquake = features[i];
        var magnitude = earthquake.properties.mag;
        var depthColor = getColor(earthquake.geometry.coordinates[2]);

        var earthquakeMarker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            radius: magnitude * 2,
            color:  depthColor,
            weight: 1,
            opacity: 1
        }).bindPopup(
            "<h2>" + earthquake.properties.title + "</h2>" +
            "</h3><h3>Place: " + earthquake.properties.place + "</h3>" +
            "</h3><h3>Magnitude: " + earthquake.properties.mag + "</h3>" +
            "</h3><h3>Depth: " + earthquake.geometry.coordinates[2] + "</h3>" 
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