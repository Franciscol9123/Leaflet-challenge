// Initialize the map centered on the world with OpenStreetMap tiles
let myMap = L.map("map", {
  center: [20, 0],
  zoom: 2
});

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; OpenStreetMap contributors'
}).addTo(myMap);

// Define the color range for earthquake depth to match the green-to-yellow scale
function getColor(depth) {
return depth > 90 ? "#ffcc00" :       // Yellow for deepest earthquakes
       depth > 70 ? "#ffcc66" :       // Lighter Yellow
       depth > 50 ? "#ff9966" :       // Light Orange
       depth > 30 ? "#66ff66" :       // Light Green
       depth > 10 ? "#33cc33" :       // Darker Green
                    "#009900";        // Dark Green for shallow earthquakes
}

// Define the marker size based on magnitude (increase size for better visibility)
function markerSize(magnitude) {
return magnitude * 6;  // Increased size scaling factor for better visualization
}

// Fetch earthquake data from the USGS GeoJSON API
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

// Add earthquake markers
data.features.forEach(function(earthquake) {
  let coordinates = earthquake.geometry.coordinates;
  let depth = coordinates[2];
  let magnitude = earthquake.properties.mag;
  let location = earthquake.properties.place;

  // Add a circle marker for each earthquake with matching stroke and fill colors
  L.circle([coordinates[1], coordinates[0]], {
    fillOpacity: 0.75,
    color: "#000000",  // Black stroke for contrast
    fillColor: getColor(depth),
    radius: markerSize(magnitude)
  }).bindPopup(`<h3>Location: ${location}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth} km</p>`)
    .addTo(myMap);
});

// Add legend to the map with the matching green-yellow color scale
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  let depths = [0, 10, 30, 50, 70, 90];
  let colors = [
    "#009900", // Dark Green for shallow earthquakes
    "#33cc33", // Lighter Green
    "#66ff66", // Light Green
    "#ff9966", // Orange
    "#ffcc66", // Light Yellow
    "#ffcc00"  // Yellow for deepest earthquakes
  ];

  div.innerHTML += '<div class="legend-title">Depth (km)</div>'; // Add title

  // Add gradient bar to the legend
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' +
    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(myMap);
});

// Fetch and plot tectonic plates data
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(plateData) {
L.geoJSON(plateData, {
  color: "black",
  weight: 2
}).addTo(myMap);
});


