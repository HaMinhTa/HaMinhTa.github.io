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
var randPoint = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

d3.queue()
    .defer(d3.json, "Data/USA.json")
    .defer(d3.csv, "Data/personData.csv")
    .await(drawMap);

let statesWithData = new Set(["Alabama", "Texas", "Mississippi", "Virginia", "South Carolina", "Tennessee", "Georgia", "Florida", "Arkansas", "Louisiana", "North Carolina"]);
let southernStates = new Set(["Alabama", "Texas", "Mississippi", "Virginia", "South Carolina", "Tennessee", "Georgia", "Florida", "Arkansas", "Louisiana", "North Carolina", "District of Columbia", "Delaware", "Kentucky", "Maryland", "Oklahoma", "West Virginia"])

function getStateColor(d) {
    let state = stateName(d);
    if (statesWithData.has(state)) return "#FFFFFF";
    else                           return "#B6B5B5";
}

function stateName(feature) {
    return feature.properties.NAME;
}

function drawMap(error, mapData, personData) {
    if (error) console.log(error);

    let map = svg.select("#map");

    let southernStateFeatures = mapData.features.filter(d => southernStates.has(stateName(d)));
    let southernStateFeatureCollection = { "type": "FeatureCollection", "features": southernStateFeatures };
    
    console.log(southernStateFeatureCollection)
    console.log(mapData)

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
    
  
    let randomCoordinates = randomStateCoordinates(mapData.features);

    delete personData.columns

    for (const person of personData) {
        let randomCoordinate = randomCoordinates("Texas");
        person.x = proj(randomCoordinate)[0]
        person.y = proj(randomCoordinate)[1]
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
            tooltip.html("<b>" + d.Name  + "</b>" + "<br>" + "Year of death: " + d.YearofDeath + "<br>Double click to see documents <br> related to this case")
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

function getStateBoundingBoxes(features) {
    let boundingBoxes = {};
    for (let feature of features) {
        boundingBoxes[feature.properties.NAME] = d3.geoBounds(feature);
    }
    return boundingBoxes;
}
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

function randomCoordinateInBoundingBox(feature, boundingBox) {
    const randomCoordinates = randomBoundingBoxCoordinates(boundingBox);
    let p;
    do {
        p = randomCoordinates()
    } while (!d3.geoContains(feature, p));
    return p;
}

function randomStateCoordinates(features) {
    const boundingBoxes = getStateBoundingBoxes(features);
    return (state) => {
        const stateFeature = features.find(element => element.properties.NAME == state);
        const randomCoordinates = randomBoundingBoxCoordinates(boundingBoxes[state]);
        let p
        do {
            p = randomCoordinates();
        } while (!d3.geoContains(stateFeature, p));
        return p
    }
}

function getBoundingBoxes(features, getKey) {
    let boundingBoxes = {};
    for (let feature of features) {
        boundingBoxes[getKey(feature)] = d3.geoBounds(feature);
    }
    return boundingBoxes;
}

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
