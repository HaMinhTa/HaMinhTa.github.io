const START_LAT = 42.3218611;
const START_LONG = -71.0618929;
const START_ZOOM = 13;

const URL = "https://api-v3.mbta.com/vehicles";
const INTERVAL = 500;

let selector = document.getElementById("selector");
let currentRoute = "15";

let map = L.map('map').setView([START_LAT, START_LONG], START_ZOOM);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZGR1cGxhbnQiLCJhIjoiY2p5MzU5Y2FpMHcyMjNicTh1c3Jqbzl1dyJ9.u02VQdp7VPZCOMT-RYn-VA'
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
    .attr("cx", (d) => { return map.latLngToLayerPoint([d.lat, d.long]).x; })
    .attr("cy", (d) => { return map.latLngToLayerPoint([d.lat, d.long]).y; });
}

// Add/update circles on Leaflet map
function update(data) {
  let circles = d3.select("#map").select("svg").selectAll("circle").data(data)
    .attr("cx", (d) => { return map.latLngToLayerPoint([d.lat, d.long]).x; })
    .attr("cy", (d) => { return map.latLngToLayerPoint([d.lat, d.long]).y; });

  circles.enter().append("circle")
    .attr("cx", (d) => { return map.latLngToLayerPoint([d.lat, d.long]).x; })
    .attr("cy", (d) => { return map.latLngToLayerPoint([d.lat, d.long]).y; })
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
  d3.json(URL).then(processData);
}
