var width = window.innerWidth -50;
var height = window.innerHeight;

var svg = d3.select("#viz")
  .attr("width", width)
  .attr("height", height);


var map = svg.select("#map");

var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "black")
        .style("border-radius", "6px");

d3.queue()
  .defer(d3.csv, "H1BEmployerMain.csv")
  .defer(d3.json, "USA.json")
  .await(drawMap);

function drawMap(error, h1bData, geoData) {
  var projection = d3.geoAlbersUsa()
    .fitSize([width+100, height+100], geoData);

  var path = d3.geoPath()
      .projection(projection);

  var states = map.selectAll("path")
      .data(geoData.features);

      states.enter().append("path")
          .attr("d", path)
          .attr("stroke","black")
          .attr("fill", d => {
            let state = d.properties.NAME.split(" ").join("");
            let id = `${state}Logo`;
            return `url(#${id})`;
          })
          .on("mouseover", function(d, i) {
              d3.select(this).style("opacity", "0.9");
              var state = d.properties.NAME;
              var employer = findEmployer(state, h1bData);
              tooltip.transition().duration(100)
              tooltip.html(`<span class="state_text">${state}<br></span> <span class="category_text">Company: ${employer}</span>`)

              .attr("class", "tooltipText")
              .style("left", d3.event.pageX + 20 + "px")
              .style("top", d3.event.pageY + 20 + "px")
              .style("opacity", 0.8)
              .style("padding", "6px 10px");
          })
          .on("mouseout", function() {
              d3.select(this).style("opacity", "1")
              tooltip.html("")
              .style("padding", "0");
          });
}

function findEmployer(stateToFind, allStates) {
  for (state of allStates) {
    if (state.state === stateToFind) {
      return state.employer;
    }
  }
}


