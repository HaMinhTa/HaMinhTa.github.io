var width = window.innerWidth;
var height = window.innerHeight;

var svg = d3.select("#viz2")
  .attr("width", width)
  .attr("height", height);

svg.select("#ocean2")
  .attr("width", width)
  .attr("height", height);

var map2 = svg.select("#map2");

// var zoom = d3.zoom()
//   .translateExtent([[0, 0], [width, height]])
//   .scaleExtent([1, 8])
//   .on("zoom", zoomed);

// function zoomed() {
//     map2.attr("transform", d3.event.transform);
// }

// svg.call(zoom)
//   .on("dblclick.zoom", null);

// var tooltip = d3.select("body")
//         .append("div")
//         .attr("class", "tooltip")
//         .style("position", "absolute")
//         .style("background", "#ccf5ff")
//         .style("border-radius", "6px");

d3.queue()
  .defer(d3.csv, "H1BEmployerMain.csv")
  .defer(d3.json, "USA.json")
  .await(drawMap);

function drawMap(error, h1bData, geoData) {
  var projection = d3.geoAlbersUsa()
    .fitSize([width, height], geoData);

  var path = d3.geoPath()
      .projection(projection);

  var maximum = d3.max(h1bData, function(d) {
      return parseInt(d.totalapprovals);
    });

  var stateColor = d3.scaleSequential(d3.interpolateWarm)
      .domain([0, maximum]);

  var states = map2.selectAll("path")
      .data(geoData.features);

  console.log(geoData);

      states.enter().append("path")
          .attr("d", path)
          .attr("stroke","white")
          .attr("fill", function(d) {
              for (element of h1bData) {
                  if (element.state === d.properties.NAME) {
                      return stateColor(element.totalapprovals);
                  }
              }
          })
          // .attr("fill", d => {
          //   let id = `${d.properties.NAME}Logo`;
          //   return `url(#${id})`;
          // })
          .on("mouseover", function(d, i) {
              d3.select(this).style("opacity", "0.4");
              var state = d.properties.NAME;
              var approvals = findEmployer(state, h1bData);
              tooltip.transition().duration(100)
              tooltip.html(`<b>${state}:</b> ${approvals}`)
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
      return state.totalapprovals;
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
