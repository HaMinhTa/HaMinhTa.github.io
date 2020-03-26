var width = window.innerWidth;
var height = window.innerHeight;

var svg = d3.select("#viz")
  .attr("width", width)
  .attr("height", height);

svg.select("#ocean")
  .attr("width", width)
  .attr("height", height);

var map = svg.select("#map");

// var zoom = d3.zoom()
//   .translateExtent([[0, 0], [width, height]])
//   .scaleExtent([1, 8])
//   .on("zoom", zoomed);

// function zoomed() {
//     map.attr("transform", d3.event.transform);
// }

// svg.call(zoom)
//   .on("dblclick.zoom", null);

var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#ccf5ff")
        .style("border-radius", "6px");

d3.queue()
  .defer(d3.csv, "H1BEmployerMain.csv")
  .defer(d3.json, "USA.json")
  .await(drawMap);

function drawMap(error, h1bData, geoData) {
  var projection = d3.geoAlbersUsa()
    .fitSize([width, height], geoData);

  var path = d3.geoPath()
      .projection(projection);

  var states = map.selectAll("path")
      .data(geoData.features);

      states.enter().append("path")
          .attr("d", path)
          .attr("stroke","white")
          // .attr("fill", function(d) {
          //     for (element of h1bData) {
          //         if (element.state === d.properties.NAME) {
          //             return fieldToColor(element.category);
          //         }
          //     }
          // })
          .attr("fill", d => {
            let id = `${d.properties.NAME}Logo`;
            return `url(#${id})`;
          })
          .on("mouseover", function(d, i) {
              d3.select(this).style("opacity", "0.4");
              var state = d.properties.NAME;
              var employer = findEmployer(state, h1bData);
              tooltip.transition().duration(100)
              tooltip.html(`<b>${state}:</b> ${employer}`)
              .style("left", d3.event.pageX + 20 + "px")
              .style("top", d3.event.pageY + 20 + "px")
              .style("opacity", 1)
              .style("font-size", "16px")
              .style("padding", "8px 8px");
          })
          .on("mouseout", function() {
              d3.select(this).style("opacity", "1")
              // .attr("fill", function(d) {
              //   var employerField = employerData[2][`"${d.properties.NAME}"`];
              //   return fieldToColor(employerField);
              // })
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

function fieldToColor(employerField) {
  if (employerField === "University") {
        return "#ffc100";
      } else if (employerField === "Health") {
        return "#ff4d00";
      } else if (employerField === "Technology") {
        return "#ff7400";
      } else if (employerField === "Consulting") {
        return "#fcf0a2";
      } else {
        return "#9e5105";
      }
}
