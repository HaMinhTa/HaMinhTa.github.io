let rellax = new Rellax('.rellax');
let width = window.innerWidth;
let height = window.innerHeight;
let mapWidth = window.innerWidth - 80;
let mapHeight = window.innerHeight / 1.21;
let wordBoardHeight = height - 110;
let xValueofLegendCircle = width / 3;
let xValueofLegendText = xValueofLegendCircle + 20;
let margin = 5;
let initialRadius = 4;
let initialYearRadius = 6;
let hoverRadius = 8;
let initialDotColor = "red";
let hoverDotColor = "black";
let originalOpacity = 0.6;
let hoverOpacity = 1;
let initialDotColorPolice = "#1F51FF"
let initialDotColorCivilian = "orange"
let colorOfStatesWithData = "#000000"
let colorOfStatesWithoutData = "#2d2e2d"
let tipDiv = d3.select("#tipDiv")

let svg = d3.select("#viz")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("x", 0)
    .attr("y", 0);

// let svg = d3.select("#viz")
//     .attr("width", mapWidth)
//     .attr("height", mapHeight);

let svgWordBoard = d3.select("#dataViz")
    .attr("width", width)
    .attr("height", wordBoardHeight);

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltipClass")
    .style("position", "absolute");
    
// Generate 4000 random points in random positions
// var randPoint = function (min, max) {
//     return Math.floor(Math.random() * (max - min)) + min;
// }

d3.csv("Data/personData.csv", function (personData) {
    let nameList = [];
    for (const person of personData) {
        nameList.push({ name: person.Name, ID: person.ID })
    }

    d3.layout.cloud().size([width, wordBoardHeight])
        .words(nameList)
        .rotate(0)
        .fontSize(30)
        .on("end", draw)
        .start();

    function draw(words) {
        var text = svgWordBoard.attr("class", "wordcloud")
            .append("g")
            // without the transform, words would get cutoff to the left and top, they would
            // appear outside of the SVG area
            .attr("transform", "translate(650,360)")
            .selectAll("text")
            .data(words)
            .enter()
            .append("a")
            .attr("xlink:href", d => "https://crrjarchive.org/people/" + d.ID, '_blank')
            .append("text")
            .attr("class", "names")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.name; })
            .style("fill", "black");
        text.transition()
            .delay(function (d, i) { return 250 * i; })
            .duration(3000)
            .style("fill", "white");
    }
});

d3.queue()
    .defer(d3.json, "Data/USA.json")
    .defer(d3.csv, "Data/incidentSampleData.csv")
    .await(drawMap);

let statesWithData = new Set(["Alabama", "Texas", "Mississippi", "Virginia", "South Carolina", "Tennessee", "Georgia", "Florida", "Arkansas", "Louisiana", "North Carolina"]);
let southernStates = new Set(["Alabama", "Texas", "Mississippi", "Virginia", "South Carolina", "Tennessee", "Georgia", "Florida", "Arkansas", "Louisiana", "North Carolina", "District of Columbia", "Delaware", "Kentucky", "Maryland", "Oklahoma", "West Virginia"])
let abbrv = { 'Alabama': "AL", 'Arkansas': "AR", 'Florida': 'FL', 'Georgia': 'GA', 'Louisiana': 'LA', 'Mississippi': 'MS', 'North Carolina': 'NC', 'South Carolina': 'SC', 'Tennessee': 'TN', 'Texas': 'TX', 'Virginia': 'VA' };

function getStateColor(d) {
    let state = stateName(d);
    if (statesWithData.has(state)) return colorOfStatesWithData;
    else return colorOfStatesWithoutData;
}

function stateName(feature) {
    return feature.properties.NAME;
}


// Draw map

function drawMap(error, mapData, incidentData) {
    if (error) console.log(error);

    delete incidentData.columns;

    // Group data 

    let nest = d3.nest()
        .key(function (d) { return d.year; })
        .entries(incidentData);

    console.log(nest);

    // Draw a dropdown list 
    let dropdownMenuYearListSet = new Set();

    for (const incident in incidentData) {
        dropdownMenuYearListSet.add(incidentData[incident].year);
    }
    let dropdownMenuYearList = Array.from(dropdownMenuYearListSet).sort()
    dropdownMenuYearList.unshift("All")
    dropdownMenuYearList.unshift("Year")
    console.log(dropdownMenuYearList)

    let yearMenu = d3.select("#year-dropdown")

    yearMenu
        .append("select")
        .attr("id", "yearMenu")
        .selectAll("option")
        .data(dropdownMenuYearList)
        .enter()
        .append("option")
        .attr("value", function (d, i) { return i; })
        .text(function (d) { return d });

    yearMenu.on("change", function () {
        var selectedYearIndex = d3.select(this)
            .select("select")
            .property("value");
        updateMap(dropdownMenuYearList[selectedYearIndex]);
    })

    let map = svg.select("#map");

    let southernStateFeatures = mapData.features.filter(d => southernStates.has(stateName(d)));
    let southernStateFeatureCollection = { "type": "FeatureCollection", "features": southernStateFeatures };

    let proj = d3.geoAlbersUsa()
        .fitSize([width, height], southernStateFeatureCollection);

    let path = d3.geoPath()
        .projection(proj);

    svg.append("circle").attr("cx", xValueofLegendCircle).attr("cy", 50).attr("r", 8).style("fill", initialDotColorPolice).attr("id", "policeLegendDot").style("visibility", "hidden")
    svg.append("circle").attr("cx", xValueofLegendCircle).attr("cy", 80).attr("r", 8).style("fill", initialDotColorCivilian).attr("id", "civilianLegendDot").style("visibility", "hidden")
    svg.append("text").attr("x", xValueofLegendText).attr("y", 50).text("Killed by Law Enforcement").attr("class", "legendText").attr("alignment-baseline", "middle").attr("id", "policeLegend").style("visibility", "hidden")
    svg.append("text").attr("x", xValueofLegendText).attr("y", 80).text("Killed by Civilian").attr("class", "legendText").attr("alignment-baseline", "middle").attr("id", "civilianLegend").style("visibility", "hidden")

    map.selectAll("path")
        .data(southernStateFeatures)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "#B6B5B5")
        .attr("fill", getStateColor)
        .style("opacity", "1");

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
    for (const person of incidentData) {
        if (person.state == "Georgia") {
            let randomCoordinate = randomCoordinates("Georgia");
            // randomCoordinate = [long, lat] long -> x lat -> y
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.state == "Mississippi") {
            let randomCoordinate = randomCoordinates("Mississippi");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.state == "Texas") {
            let randomCoordinate = randomCoordinates("Texas");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.state == "Alabama") {
            let randomCoordinate = randomCoordinates("Alabama");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.state == "Florida") {
            let randomCoordinate = randomCoordinates("Florida");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.state == "Louisiana") {
            let randomCoordinate = randomCoordinates("Louisiana");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.state == "Arkansas") {
            let randomCoordinate = randomCoordinates("Arkansas");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.state == "North Carolina") {
            let randomCoordinate = randomCoordinates("North Carolina");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.state == "South Carolina") {
            let randomCoordinate = randomCoordinates("South Carolina");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else if (person.state == "Virginia") {
            let randomCoordinate = randomCoordinates("Virginia");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        } else {
            let randomCoordinate = randomCoordinates("Tennessee");
            person.x = proj(randomCoordinate)[0]
            person.y = proj(randomCoordinate)[1]
        };
    }

    function assignDotColor(d) {
        if (d.police == "yes") {
            return initialDotColorPolice;
        } else {
            return initialDotColorCivilian;
        }
    }
    function drawInitialDots() {
        var dots = svg.selectAll("circle")
            .data(incidentData)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("fill", assignDotColor)
            .style("opacity", originalOpacity)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", initialRadius)
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .style("opacity", hoverOpacity)
                    .attr("r", hoverRadius);
                // .style("fill", hoverDotColor);
                tooltip.html("<strong>" + d.victimName + "</strong>" + "<br>" + "<b>Year of death:</b> " + d.year + "<br>" + "<b>State:</b> " + d.state + "<br><i>Double click to see documents <br> related to this case</i>")
                    .style("left", d3.event.pageX + 10 + "px")
                    .style("top", d3.event.pageY + 10 + "px")
                    .style("padding", "10px 10px")
                    .style("border", "1px ridge #ffffff");
            })
            .on("mouseout", function () {
                d3.select(this).style("opacity", originalOpacity)
                    .attr("r", initialRadius)
                // .style("fill", assignDotColor)
                tooltip.html("")
                    .style("padding", "0")
                    .style("border", "0");
            })
            .on("click", function(d, i) {
                tipDiv.html("Case Summary")
                tipDiv.html(`${d.abstract}`)
            })
            .on("dblclick", d => window.open("https://crrjarchive.org/people/" + d.victimID, '_blank'));
    };

    // drawInitialDots();

    function updateMap(year) {
        let selectYear = nest.find(function (d) {
            if (year == "All") {
                drawInitialDots() 
            } else {
            return d.key == year;
            }
        })

        // Update the data 
        var dots = svg.selectAll(".circle")
            .data(selectYear.values)

        // Remove old data points
        dots.exit().remove();

        // Update existing points
        dots.transition()
            .duration(500)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", initialYearRadius)
        dots.on("mouseover", function (d, i) {
            d3.select(this)
                .style("opacity", hoverOpacity)
                .attr("r", hoverRadius);
            // .style("fill", hoverDotColor);
            tooltip.html("<strong>" + d.victimName + "</strong>" + "<br>" + "<b>Year of death:</b> " + d.year + "<br>" + "<b>State:</b> " + d.state + "<br><i>Double click to see documents <br> related to this case</i>")
                .style("left", d3.event.pageX + 10 + "px")
                .style("top", d3.event.pageY + 10 + "px")
                .style("padding", "10px 10px")
                .style("border", "1px ridge #ffffff");
        })
            .on("mouseout", function () {
                d3.select(this).style("opacity", originalOpacity)
                    .attr("r", initialYearRadius)
                // .style("fill", assignDotColor)
                tooltip.html("")
                    .style("padding", "0")
                    .style("border", "0");
            })
            .on("dblclick", d => window.open("https://crrjarchive.org/people/" + d.victimID, '_blank'));
    }
    function showdownArrow() {
        arrow = document.getElementById("downArrow");
        arrow.style.visibility = 'visible';
    }

    var WAYPOINT = new Waypoint({
        element: document.querySelector("#trigger3"),
        handler: function (direction) {
            if (direction === "down") {
                showdownArrow();
            }
        }
    })
    var WAYPOINT2 = new Waypoint({
        element: document.querySelector("#trigger1"),
        handler: function (direction) {
            if (direction === "down") {
                var dots = svg.selectAll("circle")
                    .data(incidentData)
                    .enter()
                    .append("circle")
                    .attr("fill", assignDotColor)
                    .style("opacity", function(d) {
                        if (d.police == "yes") {
                            return 0;
                        } else {
                            return 1;
                        }
                    })
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .attr("r", initialRadius)
                    .on("mouseover", function (d, i) {
                        d3.select(this)
                            .style("opacity", hoverOpacity)
                            .attr("r", hoverRadius);
                        // .style("fill", hoverDotColor);
                        tooltip.html("<strong>" + d.victimName + "</strong>" + "<br>" + "<b>Year of death:</b> " + d.year + "<br>" + "<b>State:</b> " + d.state + "<br><i>Double click to see documents <br> related to this case</i>")
                            .style("left", d3.event.pageX + 10 + "px")
                            .style("top", d3.event.pageY + 10 + "px")
                            .style("padding", "10px 10px")
                            .style("border", "1px ridge #ffffff");
                    })
                    .on("mouseout", function () {
                        d3.select(this).style("opacity", originalOpacity)
                            .attr("r", initialRadius)
                        // .style("fill", assignDotColor)
                        tooltip.html("")
                            .style("padding", "0")
                            .style("border", "0");
                    })
                    .on("dblclick", d => window.open("https://crrjarchive.org/people/" + d.ID, '_blank'))
                document.getElementById("civilianLegend").style.visibility = 'visible';
                document.getElementById("civilianLegendDot").style.visibility = 'visible';

            }
        }
    })


    var WAYPOINT3 = new Waypoint({
        element: document.querySelector("#trigger2"),
        handler: function (direction) {
            if (direction === "down") {
                var dots = svg.selectAll("circle")
                    .style("opacity", 1);
                document.getElementById("policeLegend").style.visibility = 'visible';
                document.getElementById("policeLegendDot").style.visibility = 'visible';

            }

        }
    })
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
