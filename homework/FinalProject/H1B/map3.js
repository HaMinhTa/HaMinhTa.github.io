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

  var setOfFields = new Set();
  var legendData = h1bData.map(function(d) { return {category: d.category, color: fieldToColor(d.category)}; });
  legendData = legendData.filter(function(d) {
    if (setOfFields.has(d.category)) { 
      return false; 
    }
    else { 
      setOfFields.add(d.category); 
      return true; 
    }
  });
  legendData = legendData.filter(function(d, i) { return d.color !== "#9e5105" });
  legendData.push({category: "Other", color: "#9e5105"});

  var legendX = 0;
  var legendY = 10;
  var legendSize = 20;
  var legend = d3.select("#legend3")
    .attr("transform", `translate(${legendX}, ${legendY})`);
  
  var legendRects = legend.selectAll("rect").data(legendData);
  var legendRectsEnter = legendRects.enter().append("rect");

  legendRects.merge(legendRectsEnter)
    .attr("x", 0)
    .attr("y", function(d, i) { return i * legendSize + (i * 5); })
    .attr("fill", function(d) { return d.color; })
    .attr("width", legendSize)
    .attr("height", legendSize);
  
  var legendTexts = legend.selectAll("text")
    .data(legendData);

  var legendTextsEnter = legendTexts.enter().append("text")
    .attr("class", "legendText3")
    .attr("baseline-shift", "-100%");

  legendTexts.merge(legendTextsEnter)
    .attr("x", legendSize + 5)
    .attr("y", function(d, i) {
      return i * legendSize + i * 5;
    })
    .text(function(d) {
      return d.category;
    });

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
          tooltip.html(`<span class="state_text">${state}<br></span> <span class="category_text">Industry: ${category}</span>`)
          .attr("class", "tooltipText")
          .style("left", d3.event.pageX + 20 + "px")
          .style("top", d3.event.pageY + 20 + "px")
          .style("opacity", 0.8)
          .style("padding", "8px 10px");
      })
      .on("mouseout", function() {
          d3.select(this).style("opacity", "1")

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
