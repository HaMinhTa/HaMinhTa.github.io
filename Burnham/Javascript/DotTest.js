let width = window.innerWidth;
let height = window.innerHeight;
let margin = 5;
let initialRadius = 4;
let hoverRadius = 8;
let initialDotColor = "red";
let hoverDotColor = "black";
let originalOpacity = 0.4;
let hoverOpacity = 1;

let svg = d3.select("#viz")
    .attr("width", width)
    .attr("height", height);

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute");

// Generate 4000 random points in random positions
// var randPoint = function (min, max) {
//     return Math.floor(Math.random() * (max - min)) + min;
// }

d3.queue()
    .defer(d3.json, "Data/USA.json")
    .defer(d3.csv, "Data/personData.csv")
    .await(drawMap);

let statesWithData = new Set(["Alabama", "Texas", "Mississippi", "Virginia", "South Carolina", "Tennessee", "Georgia", "Florida", "Arkansas", "Louisiana", "North Carolina"]);
let southernStates = new Set(["Alabama", "Texas", "Mississippi", "Virginia", "South Carolina", "Tennessee", "Georgia", "Florida", "Arkansas", "Louisiana", "North Carolina", "District of Columbia", "Delaware", "Kentucky", "Maryland", "Oklahoma", "West Virginia"])
let abbrv = { 'Alabama': "AL", 'Arkansas': "AR", 'Florida': 'FL', 'Georgia': 'GA', 'Louisiana': 'LA', 'Mississippi': 'MS', 'North Carolina': 'NC', 'South Carolina': 'SC', 'Tennessee': 'TN', 'Texas': 'TX', 'Virginia': 'VA' };

function getStateColor(d) {
    let state = stateName(d);
    if (statesWithData.has(state)) return "#FFFFFF";
    else return "#B6B5B5";
}

function stateName(feature) {
    return feature.properties.NAME;
}

function drawMap(error, mapData, personData, georgiaData, mississippiData, texasData, alabamaData, floridaData, louisianaData, arkansasData, northCarolinaData, southCarolinaData, tennesseeData, virginiaData) {
    if (error) console.log(error);

    let map = svg.select("#map");

    let southernStateFeatures = mapData.features.filter(d => southernStates.has(stateName(d)));
    let southernStateFeatureCollection = { "type": "FeatureCollection", "features": southernStateFeatures };

    let proj = d3.geoAlbersUsa()
        .fitSize([width, height], southernStateFeatureCollection);

    let path = d3.geoPath()
        .projection(proj);

    map.selectAll("path")
        .data(southernStateFeatures)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "#B6B5B5")
        .attr("fill", getStateColor)
        .style("opacity", "0.8");

    map.selectAll("text")
        .data(mapData.features)
        .enter()
        .append("text")
        .text(function (d) {
            let stateName = d.properties.NAME;
            if (abbrv[stateName]) {
                return abbrv[stateName];
            } else {
                return "";
            }
        })
        .attr("text-anchor", "middle")
        .attr("class", "mapText")
        .attr("x", d => {
            return path.centroid(d)[0];
        })
        .attr("y", d => path.centroid(d)[1]);

    // randomStateCoordinates returns function that creates random [long, lat] pairs
    let randomCoordinates = randomStateCoordinates(mapData.features);

    // delete georgiaData.columns
    for (const person of personData) {
        console.log(person)
        if (person.State == "Georgia") {
            let randomCoordinate = randomCoordinates("Georgia");
            // randomCoordinate = [long, lat] long -> x lat -> y
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.State == "Mississippi") {
            let randomCoordinate = randomCoordinates("Mississippi");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.State == "Texas") {
            let randomCoordinate = randomCoordinates("Texas");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.State == "Alabama") {
            let randomCoordinate = randomCoordinates("Alabama");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.State == "Florida") {
            let randomCoordinate = randomCoordinates("Florida");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.State == "Louisiana") {
            let randomCoordinate = randomCoordinates("Louisiana");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.State == "Arkansas") {
            let randomCoordinate = randomCoordinates("Arkansas");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.State == "North Carolina") {
            let randomCoordinate = randomCoordinates("North Carolina");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.State == "South Carolina") {
            let randomCoordinate = randomCoordinates("South Carolina");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.State == "Virginia") {
            let randomCoordinate = randomCoordinates("Virginia");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else {
            let randomCoordinate = randomCoordinates("Tennessee");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        };
    }

    var dots = svg.selectAll("circle")
        .data(personData)
        .enter()
        .append("circle")
        .attr("fill", initialDotColor)
        .style("opacity", originalOpacity)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", initialRadius)
        .on("mouseover", function (d, i) {
            d3.select(this)
                .style("opacity", hoverOpacity)
                .attr("r", hoverRadius)
                .style("fill", hoverDotColor);
            tooltip.html("<b>" + d.Name + "</b>" + "<br>" + "<b>Year of death:</b> " + d.YearofDeath + "<br>" + "<b>State:</b> " + d.State + "<br><i>Double click to see documents <br> related to this case</i>")
                .style("left", d3.event.pageX + 10 + "px")
                .style("top", d3.event.pageY + 10 + "px")
                .style("padding", "10px 10px");
        })
        .on("mouseout", function () {
            d3.select(this).style("opacity", originalOpacity)
                .attr("r", initialRadius)
                .style("fill", initialDotColor)
            tooltip.html("")
                .style("padding", "0");


        })
        .on("dblclick", d => window.open("https://crrjarchive.org/people/" + d.ID, '_blank'));
};

// Adapted from https://observablehq.com/@jeffreymorganio/random-coordinates-within-a-country
function randomBoundingBoxCoordinates(boundingBox) {
    const randomLongitude = d3.randomUniform(
        boundingBox[0][0],
        boundingBox[1][0] + 360 * (boundingBox[1][0] < boundingBox[0][0])
    )
    const randomLatitude = d3.randomUniform(boundingBox[0][1], boundingBox[1][1])
    return () => [randomLongitude(), randomLatitude()]
}

function randomFeatureCoordinates(feature) {
    const featureBoundingBox = d3.geoBounds(feature)
    const randomCoordinates = randomBoundingBoxCoordinates(featureBoundingBox)
    return () => {
        let p
        do {
            p = randomCoordinates()
        } while (!d3.geoContains(feature, p));
        return p
    }
}

/* Returns an object containing the bounding boxes of US states.
 * features: array of geojson features of US states.
 * For example, boundingBox might look like:
 * boundingBoxes = { "Alabama": [[-88,33], [-87, 32]], "Texas": [[-88,33], [-87, 32]], ... }
 */
function getStateBoundingBoxes(features) {
    let boundingBoxes = {};
    for (const feature of features) {
        boundingBoxes[feature.properties.NAME] = d3.geoBounds(feature);
    }
    return boundingBoxes;
}

/* Returns a function that creates a random [long, lat] coordinates in a given state. 
 * features: array of geojson features for US states.
 */
function randomStateCoordinates(features) {
    const boundingBoxes = getStateBoundingBoxes(features);
    return (state) => {
        const stateFeature = features.find(f => f.properties.NAME == state);
        const randomCoordinates = randomBoundingBoxCoordinates(boundingBoxes[state]);
        let p
        do {
            p = randomCoordinates();
        } while (!d3.geoContains(stateFeature, p));
        return p
    }
}


// Experimental
function getBoundingBoxes(features, getKey) {
    let boundingBoxes = {};
    for (let feature of features) {
        boundingBoxes[getKey(feature)] = d3.geoBounds(feature);
    }
    return boundingBoxes;
}

// Experimental
function randomFeatureCollectionCoorindates(features, getKey) {
    const boundingBoxes = getBoundingBoxes(features, getKey);
    return (featureKey) => {
        const feature = features.find(f => getKey(f) == featureKey);
        const randomCoordinates = randomBoundingBoxCoordinates(boundingBoxes[featureKey]);
        let coordinate;
        do {
            coordinate = randomCoordinates();
        } while (!d3.geoContains(feature, coordinate));
        return coordinate;
    }
}
