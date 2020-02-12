const startLat = 42.3373574;
const startLong = -71.1399774;
const startZoom = 13;

let myIcon = L.icon({
    iconUrl: 'image/greenline.png',
    iconSize: [40, 40],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

let mbtaMap = L.map('mbtamap').setView([startLat, startLong], startZoom);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZGR1cGxhbnQiLCJhIjoiY2p5MzU5Y2FpMHcyMjNicTh1c3Jqbzl1dyJ9.u02VQdp7VPZCOMT-RYn-VA'
}).addTo(mbtaMap);

var svg = d3.select(mbtaMap.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

let realtimeURL = "https://api-v3.mbta.com/vehicles"

function fetchData() {
    d3.json(realtimeURL, function(error, response) {
        let GreenCs = getGreenCData(response);
        addIconsToMap(GreenCs);
        console.log(response);
    })

}


function getGreenCData(response) {
    let GreenC = [];
    for (element of response.data) {
        if (element.relationships.route.data.id === "Green-C") {
            let latlong = {"lat": element.attributes.latitude, "long": element.attributes.longitude};
            GreenC.push(latlong);
        }
    }
    return GreenC;
}

function addIconsToMap(latlong) {
    // loop through latlong, and add icon to map for each latlong pair
    for (element of latlong) {
        L.marker([element.lat, element.long]).addTo(mbtaMap);
    }
}

let frequency = 3000;
fetchData();
setInterval(fetchData, frequency);



