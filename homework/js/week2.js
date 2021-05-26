const START_LAT = 42.3218611;
const START_LONG = -71.0618929;
const START_ZOOM = 13;

const URL = "https://api-v3.mbta.com/vehicles";
const INTERVAL = 3000;

let selector = document.getElementById("selector");
let currentRoute = "15";

let map = L.map('map').setView([START_LAT, START_LONG], START_ZOOM);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 256,
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiaGF0YTE5OTQiLCJhIjoiY2ptaTl6MnV0MDF6ejNxbXc4a2pwaTlwZCJ9.WceTUkYsuTOCswt2X13L3Q'
}).addTo(map);

L.svg().addTo(map);
map.on("moveend", reset);

selector.addEventListener("change", run);

function run(event) {
  currentRoute = event.target.value;
  fetchData();
  setInterval(fetchData, INTERVAL);
}

// Filter out all elements of data that do not contain the given key
function filter(data, key) {
  let filteredData = [];

  for (element of data["data"]) {
    // The key is the route id (e.g. "Red" for Red line, "15" for Bus 15, etc.)
    // The id is located at element.relationships.route.id
    if (element["relationships"]["route"]["data"]["id"] === key) {
      let lat = element["attributes"]["latitude"];
      let long = element["attributes"]["longitude"];
      filteredData.push({lat: lat, long: long});
    }
  }

  return filteredData;
}

// Redraw svg circles on Leaflet map every time a pan/zoom occurs
function reset() {
  d3.selectAll("circle")
    .attr("cx", function(d) { return map.latLngToLayerPoint([d.lat, d.long]).x; })
    .attr("cy", function(d) { return map.latLngToLayerPoint([d.lat, d.long]).y; });
}

// Add/update circles on Leaflet map
function update(data) {
  let circles = d3.select("#map").select("svg").selectAll("circle").data(data)
    .attr("cx", function(d) { return map.latLngToLayerPoint([d.lat, d.long]).x; })
    .attr("cy", function(d) { return map.latLngToLayerPoint([d.lat, d.long]).y; });

  circles.enter().append("circle")
    .attr("cx", function(d) { return map.latLngToLayerPoint([d.lat, d.long]).x; })
    .attr("cy", function(d) { return map.latLngToLayerPoint([d.lat, d.long]).y; })
    .attr("r", 10)
    .style("fill", "red")
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr("fill-opacity", .4);

  circles.exit().remove();
}

function processData(data) {
  let filteredData = filter(data, currentRoute);
  update(filteredData);
}

function fetchData() {
  d3.json(URL, processData);
}
