var margin = {top: 90, right: 30, bottom: 60, left: 60},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var legendMargin = {
    top: 20,
    right: 150,
    bottom: 100,
    left: 50
      };

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "#ccf5ff")
    .style("border-radius", "6px");

var svg = d3.select("#viz4")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("h1bDenialRate.csv", function(error, data) {
console.log(data);

var x = d3.scaleLinear()
    .domain([2009, 2019])
    .range([0, width]);

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
        return parseFloat(d.denialrate);
    })])
    .range([height, 0]);

   
var r = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
        return parseInt(d.totalapplication);
    })])
    .range([0, 60]);

svg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
svg.append('g')
    .selectAll("circle")
    .attr("class", "circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { 
          return x(d.year); 
        } )
      .attr("cy", function (d) { 
        return y(d.denialrate); 
    } )
      .attr("r", function (d) {
          return r(d.totalapplication);
      })
      .style("fill", function(d) {
          if (d.pandemic === "Coronavirus") {
              return "green";
          } else if (d.pandemic === "H1N1") {
              return "blue";
          } else if (d.pandemic === "Ebola") {
              return "red";
          } else if (d.pandemic === "AIDS") {
              return "purple";
          } else {
              return "#039DFA";
          }
      })
      .style("opacity", "0.3")
      .on("mouseover", function(d, i) {
        d3.select(this).style("opacity", "0.7")
        tooltip.transition().duration(50)
        tooltip.html(`Denial rate: ${d.denialrate}<br> Total application: ${d.totalapplication}`)
        .style("left", d3.event.pageX - 80 + "px")
        .style("top", d3.event.pageY - 80 + "px")
        .style("opacity", 1)
        .style("padding", "8px 10px")
        .style("border-radius", "5px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill","#00ccff").style("opacity", "0.3")
        tooltip.html("")
        .style("padding", "0");
      });

});