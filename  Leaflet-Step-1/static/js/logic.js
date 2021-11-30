const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Perform API call
d3.json(url).then(data => {
    console.log(data);

    createMarkers(data.features);
});

// function selects a color for the earthquake depth
function getColor(earthquake) {

    depth = earthquake.geometry.coordinates[2];
    var mag = earthquake.properties.mag * 2;
    var color;
    
    depth >= 90 ? color = '#ff5f65' :
    depth >= 70  ? color = '#fca35d' :
    depth >= 50  ? color = '#fdb72a' :
    depth >= 30  ? color = '#f7db11' :
    depth >= 10   ? color = '#ddf400' :
        color = '#a4f600' ;
    
    var geojsonMarkerOptions = {
        radius: mag,
        fillColor: color,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    return geojsonMarkerOptions;
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

    legend.onAdd = function (map) {
 
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];
            colors = ['#ff5f65', '#fca35d', '#fdb72a', '#f7db11', '#ddf400', '#a4f600']; 
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
 
    legend.addTo(map);
}

function createMarkers(earthquakes) {

    // Function that will add a pop up with info about an earthquake.
    function onEachFeature(earthquake, layer) {
        layer.bindPopup(
            "<h2>" + earthquake.properties.title + "</h2>" +
            "</h3><h3>Place: " + earthquake.properties.place + "</h3>" +
            "</h3><h3>Magnitude: " + earthquake.properties.mag + "</h3>" +
            "</h3><h3>Depth: " + earthquake.geometry.coordinates[2] + "</h3>" 
        );
    }

    

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var features = L.geoJSON(earthquakes, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, getColor(feature));
        },
        onEachFeature: onEachFeature
    });

    // Pass layer to the createMap function.
    createMap(features);
}


