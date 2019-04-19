const LIGHT_BLUE = "#b3f0ff";
const BLUE = "#00ccff";
const ORANGE ="#ffbb33";
const GRAY = "#D3D3D3";

var width = 800,
    height = 700;

// var svg = d3.select("#bubblechart").append("svg")
//   .attr("width", width)
//   .attr("height", height);

var svg = d3.select("#bubblechart")
 .append("svg")
 .attr("width","100%")
 .attr("height", "100%")
 .attr('viewBox','-40 -100 900 700')
 .attr('preserveAspectRatio','xMinYMin');

var node_data = [
  {"reason": "Sanitation", "number": 27208, "year": 2012},
  {"reason": "Trees", "number": 6369, "year": 2012},
  {"reason": "Street Lights", "number": 10318, "year": 2012},
  {"reason": "Street Cleaning", "number": 9967, "year": 2012},
  {"reason": "Highway Maintenance", "number": 23303, "year": 2012},
  {"reason": "Housing", "number": 7251, "year": 2012},
  {"reason": "Signs & Signals", "number": 6340, "year": 2012},
  {"reason": "Recycling", "number": 5202, "year": 2012},
  {"reason": "Enforcement & Abandoned Vehicles", "number": 2569, "year": 2012},

  {"reason": "Sanitation", "number": 15196, "year": 2018},
  {"reason": "Trees", "number": 4634, "year": 2018},
  {"reason": "Street Lights", "number": 5156, "year": 2018},
  {"reason": "Street Cleaning", "number": 18311, "year": 2018},
  {"reason": "Highway Maintenance", "number": 15212, "year": 2018},
  {"reason": "Housing", "number": 3607, "year": 2018},
  {"reason": "Signs & Signals", "number": 7865, "year": 2018},
  {"reason": "Recycling", "number": 4285, "year": 2018},
  {"reason": "Enforcement & Abandoned Vehicles", "number": 22293, "year": 2018}
];

/* Defines a grid of (x,y) coordinates to position bubbles when categorized by type */
const grid = [
  {x: width / 4,       y: height / 4      },
  {x: width / 2,       y: height / 4      },
  {x: (4 * width) / 5, y: height / 4      },
  {x: width / 5,       y: (2 * height) / 4},
  {x: width / 2,       y: (2 * height) / 4},
  {x: (4 * width) / 5, y: (2 * height) / 4},
  {x: width / 5,       y: (2 * height) / 4 + 160},
  {x: width / 2,       y: (2 * height) / 4 + 160},
  {x: (4 * width) / 5, y: (2 * height) / 4 + 160},
];

function getRadius(d) {
  return d["number"] / 300;
}

function translateCircle(d) {
  return `translate(${d.x}, ${d.y})`
}

const forceSplit = d3.forceX(d => {
  if (d["year"] === 2012) { return width / 4; }
  else                    { return (3 * width) / 4; }
}).strength(0.5);

const forceSplitByCategoryX = d3.forceX(d => {
  var offset = getRadius(d);
  if (d["year"] === 2012) { offset *= -1; }

  switch (d["reason"]) {
    case "Sanitation":
      return grid[0].x + offset;
    case "Housing":
      return grid[1].x + offset;
    case "Street Lights":
      return grid[2].x + offset;
    case "Street Cleaning":
      return grid[3].x + offset;
    case "Enforcement & Abandoned Vehicles":
      return grid[4].x + offset;
    case "Trees":
      return grid[5].x + offset;
    case "Signs & Signals":
      return grid[6].x + offset;
    case "Recycling":
      return grid[7].x + offset;
    case "Highway Maintenance":
      return grid[8].x + offset;
  }
}).strength(0.4);

const forceSplitByCategoryY = d3.forceY(d => {
  switch (d["reason"]) {
    case "Sanitation":
      return grid[0].y;
    case "Housing":
      return grid[1].y;
    case "Street Lights":
      return grid[2].y;
    case "Street Cleaning":
      return grid[3].y;
    case "Enforcement & Abandoned Vehicles":
      return grid[4].y;
    case "Trees":
      return grid[5].y;
    case "Signs & Signals":
      return grid[6].y;
    case "Recycling":
      return grid[7].y;
    case "Highway Maintenance":
      return grid[8].y;
  }
}).strength(0.4);

const forceJoin = d3.forceX(d => width / 2).strength(0.07);

const forceY = d3.forceY(height / 2).strength(0.07);

const forceCenter = d3.forceCenter(width / 2, height / 2);

const forceCollide = d3.forceCollide(d => getRadius(d) + 2).iterations(3);

var simulation = d3.forceSimulation()
                   .nodes(node_data)
                   .force('x', forceJoin)
                   .force('y', forceY)
                   .force('center', forceCenter)
                   .force('collide', forceCollide)
                   .on("tick", tickActions);

var node = svg.append("g")
              .attr("class", "nodes")
              .selectAll("bubble")
              .data(node_data)
              .enter()
              .append("circle")
              .attr("r", getRadius)
              .attr("fill", function(d) {
                if (d["year"] === 2012) { return BLUE; }
                else                    { return ORANGE; }
              })
              .on("mouseover", function(d,i) {
                d3.select(this).attr("fill", GRAY)
                tooltip.transition().duration(100)
                tooltip.html(`Reason: <b>${d.reason}</b> <br>Number of Calls: <b>${d.number}</b>`)
                  .style("left", d3.event.pageX - 80 + "px")
                  .style("top", d3.event.pageY - 80 + "px")
                  .style("opacity", 1)
                  .style("padding", "8px 10px")
                  .style("border-radius", "5px");
              })
              .on("mouseout", function() {
                d3.select(this).attr("fill",function(d) {
                  if (d["year"] === 2012) { return BLUE; }
                  else                    { return ORANGE; }
                })
                tooltip.html("")
                  .style("padding", "0");
              });

var bluerect = svg.append("rect")
                  .attr("class", "legend")
                  .attr("x", 150)
                  .attr("y", 40)
                  .attr("width", 25)
                  .attr("height", 25)
                  .attr("fill", BLUE);

var orangerect = svg.append("rect")
                  .attr("class", "legend")
                  .attr("x", 500)
                  .attr("y", 40)
                  .attr("width", 25)
                  .attr("height", 25)
                  .attr("fill", ORANGE);

var year12 = svg.append("text").text("2012")
                  .attr("x", 200)
                  .attr("y", 62)
                  .attr("fill", "white")
                  .attr("class", "legend");

var year18 = svg.append("text").text("2018")
                  .attr("x", 550)
                  .attr("y", 62)
                  .attr("fill", "white")
                  .attr("class", "legend");

function tickActions() {
    node.attr("transform", translateCircle);
}

function noCategorization() {
  simulation.force('x', forceJoin)
            .force('y', forceY)
            .alphaTarget(0.1)
            .restart()
}

function categorizeByYear() {
  simulation.force('x', forceSplit)
            .force('y', forceY)
            .alphaTarget(0.3)
            .restart()
}

function categorizeByType() {
  simulation.force('x', forceSplitByCategoryX)
            .force('y', forceSplitByCategoryY)
            .alphaTarget(0.1)
            .restart()
}
