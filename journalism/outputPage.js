/* Set up map */
let map = null;

function setUpMap(neighborhood) {
  let startLat = viewCoords[neighborhood][0];
  let startLong = viewCoords[neighborhood][1];
  let startZoom = viewCoords[neighborhood][2];

  map = L.map('map').setView([startLat, startLong], startZoom);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
      tileSize: 256,
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoiZGR1cGxhbnQiLCJhIjoiY2p5MzU5Y2FpMHcyMjNicTh1c3Jqbzl1dyJ9.u02VQdp7VPZCOMT-RYn-VA'
  }).addTo(map);
}

/* On clicking next, switch from input page to result page */
document.getElementById("button").addEventListener("click", function() {
  document.getElementById("inputPage").hidden = true;
  document.getElementById("resultPage").hidden = false;

  let result = calculateResult();
  setUpMap(result);
  updateOutputPage(result);
});

/* Update output page to display results for calculated neighborhood */
function updateOutputPage(neighborhood) {
  document.querySelectorAll(".resultText").forEach(el => el.innerHTML = neighborhood);
  addNeighborhoodInfo(neighborhood);
  addNeighborhoodDataToMap(neighborhood);
}

function addNeighborhoodInfo(neighborhood) {
  let infoSection = document.getElementById("neighborhoodInfo");
  infoSection.innerHTML = neighborhoodInfo[neighborhood];
}

/* Add all data to map for the given neighborhood */
function addNeighborhoodDataToMap(neighborhood) {
  let boundStyle = { "color": "#ffff00" };
  let geoJSONFeature = getNeighborhoodBound(neighborhood);
  if (geoJSONFeature) {
    L.geoJSON(geoJSONFeature, { style: boundStyle }).addTo(map);
  }

  let trainMarker = L.icon({ iconUrl: 'photo/mbta.png', iconSize: [25, 25] });
  let polylines = getPolyLines(neighborhood);
  addColoredMBTARoutes(neighborhood);
  for (polyline of polylines) {
    //let trainMarker = L.icon({ iconUrl: trainMarker, iconSize: [25, 25] });
    let movingMarker = L.Marker.movingMarker(polyline.geometry, 20000, {loop: true, icon: trainMarker}).addTo(map);
    movingMarker.start();
  }
}

function addColoredMBTARoutes(neighborhood) {
  let polylinesSwitched = getPolyLinesSwitched(neighborhood);
  for (polyline of polylinesSwitched) {
    let myStyle = {
      "color": colorByRoute[polyline.routeName],
      "weight": 3
    };
    L.geoJSON({"type": "LineString", "coordinates": polyline.geometry}, {style: myStyle}).addTo(map);
  }
}
