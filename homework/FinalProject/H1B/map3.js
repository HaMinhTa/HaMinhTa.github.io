var width = window.innerWidth;
var height = window.innerHeight;

var svg = d3.select("#viz3")
  .attr("width", width)
  .attr("height", height);


var map3 = svg.select("#map3");

let abbrv = { 'Alabama': "AL", 'Alaska': "AK", 'Arizona': "AZ", 'Arkansas': "AR", 'California': "CA", 'Colorado': "CO", 'Connecticut': "CT", 'Delaware': "DE", 'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire':	 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota':	'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon':	 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'WestVirginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'};


d3.queue()
  .defer(d3.csv, "H1BEmployerMain.csv")
  .defer(d3.json, "USA.json")
  .await(drawMap);

function drawMap(error, h1bData, geoData) {
  var projection = d3.geoAlbersUsa()
    .fitSize([width, height], geoData);

  var path = d3.geoPath()
      .projection(projection);

  var states = map3.selectAll("path")
      .data(geoData.features);

      states.enter().append("path")
          .attr("d", path)
          .attr("stroke","white")
          .attr("fill", function(d) {
              for (element of h1bData) {
                  if (element.state === d.properties.NAME) {
                      return fieldToColor(element.category);
                  }
              }
          })
          .on("mouseover", function(d, i) {
              d3.select(this).style("opacity", "0.4");
              var state = d.properties.NAME;
              var category = findCategory(state, h1bData);
              tooltip.transition().duration(100)
              tooltip.html(`<b>${state}:</b> ${category}`)
              .attr("class", "tooltipText")
              .style("left", d3.event.pageX + 20 + "px")
              .style("top", d3.event.pageY + 20 + "px")
              .style("opacity", 0.8)
              .style("padding", "8px 10px");
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

          map3.selectAll("text")
          .data(geoData.features)
          .enter()
          .append("text")
          .text(function(d){
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
}

function findCategory(stateToFind, allStates) {
  for (state of allStates) {
    if (state.state === stateToFind) {
      return state.category;
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
