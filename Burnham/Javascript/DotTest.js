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
    .defer(d3.csv, "Data/Georgia.csv")
    .defer(d3.csv, "Data/Mississippi.csv")
    .defer(d3.csv, "Data/Texas.csv")
    .defer(d3.csv, "Data/Alabama.csv")
    .defer(d3.csv, "Data/Florida.csv")
    .defer(d3.csv, "Data/Louisiana.csv")
    .defer(d3.csv, "Data/Arkansas.csv")

    // .defer(d3.csv, "Data/personData.csv")
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

function drawMap(error, mapData, georgiaData, mississippiData, texasData, alabamaData, floridaData, louisianaData, arkansasData) {
    if (error) console.log(error);
    console.log(mississippiData)

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
    
  
    // randomStateCoordinates returns function that creates random [long, lat] pairs
    let randomCoordinates = randomStateCoordinates(mapData.features);

    delete georgiaData.columns

    for (const person of georgiaData) {
        let randomCoordinate = randomCoordinates("Georgia");
        // randomCoordinate = [long, lat]
        // long -> x
        // lat -> y
        person.x = proj(randomCoordinate)[0]
        person.y = proj(randomCoordinate)[1]
    }

    for (const person of mississippiData) {
        let randomCoordinate = randomCoordinates("Mississippi");
        person.x = proj(randomCoordinate)[0]
        person.y = proj(randomCoordinate)[1]
    }

    for (const person of texasData) {
        let randomCoordinate = randomCoordinates("Texas");
        person.x = proj(randomCoordinate)[0]
        person.y = proj(randomCoordinate)[1]
    }


    for (const person of alabamaData) {
        let randomCoordinate = randomCoordinates("Alabama");
        person.x = proj(randomCoordinate)[0]
        person.y = proj(randomCoordinate)[1]
    }


    for (const person of floridaData) {
        let randomCoordinate = randomCoordinates("Florida");
        person.x = proj(randomCoordinate)[0]
        person.y = proj(randomCoordinate)[1]
    }

    for (const person of louisianaData) {
        let randomCoordinate = randomCoordinates("Louisiana");
        person.x = proj(randomCoordinate)[0]
        person.y = proj(randomCoordinate)[1]
    }

    for (const person of arkansasData) {
        let randomCoordinate = randomCoordinates("Arkansas");
        person.x = proj(randomCoordinate)[0]
        person.y = proj(randomCoordinate)[1]
    }

    const stateData = mississippiData.concat(georgiaData, texasData, alabamaData, floridaData, louisianaData, arkansasData);
    console.log(stateData)


    var dots = svg.selectAll("circle")
        .data(stateData)
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
            tooltip.html("<b>" + d.Name  + "</b>" + "<br>" + "<b>Year of death:</b> " + d.YearofDeath + "<br>" + "<b>State:</b> " + d.State + "<br><i>Double click to see documents <br> related to this case</i>")
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
