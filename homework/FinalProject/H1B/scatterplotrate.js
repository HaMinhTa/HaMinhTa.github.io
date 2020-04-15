
var margin = {top: 120, right: 60, bottom: 50, left: 70},
    width = window.innerWidth/1.5 - margin.left - margin.right,
    height = window.innerHeight/1.4 - margin.top - margin.bottom;

var legendMargin = {
    top: 20,
    right: 150,
    bottom: 100,
    left: 50
      };

var svg = d3.select("#viz4")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var xLabel = svg.append("text")
    .attr("class", "axisLabel")
    .attr("x", width/2)
    .attr("y", height + margin.bottom)
    .attr("text-anchor", "middle")
    .text("Year");


var yLabel = svg.append("text")
    .attr("class", "axisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -height/2)
    .attr("text-anchor", "middle")
    .text("Denial Rate (%)");
  
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


d3.csv("h1bDenialRate.csv", function(error, data) {
console.log(data);

// var x = d3.scaleLinear()
var x = d3.scaleLinear()
    .domain([2008, 2019])
    .range([0, width]);


var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

 
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

var z = d3.scaleSqrt()
    .domain([205495, 458836])
    .range([ 2, 30]);

svg.append("g")
    .call(d3.axisLeft(y));


var chart = svg.append('g')
    .selectAll("circle")
    .attr("class", "circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { 
        return x(d.year); 
      })
      .attr("cy", function (d) { 
        return y(d.denialrate); 
        } )
      .attr("r", 0)
      .style("fill", "#039DFA")
      .style("opacity", "0.3")
      .on("mouseover", function(d, i) {
        d3.select(this).style("opacity", "0.7")
        tooltip.transition().duration(50)
        tooltip.html(`Denial rate: ${d.denialrate}<br> Total application: ${numberWithCommas(d.totalapplication)}`)
        .style("left", d3.event.pageX - 80 + "px")
        .style("top", d3.event.pageY - 80 + "px")
        .style("opacity", 0.8)
        .attr("class", "tooltipText")
        .style("padding", "8px 10px")
        .style("border-radius", "5px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill","#00ccff").style("opacity", "0.3")
        tooltip.html("")
        .style("padding", "0");
      });

    chart.transition()
        .delay(2000)
        .attr("r", function (d) {
        return r(d.totalapplication);
        })
        .delay(function(d,i) {
            return i * 150;
        });

    // Add legend: circles
    var smallCircles = [30, 40, 50];

    var maxRadius = d3.max(smallCircles);

    var lineEnd = 300;
    
    var legend = d3.select("#legend4")
      .attr("transform", `translate(${150}, ${150})`);


    legend.selectAll("circle")
      .data(smallCircles)
      .enter().append("circle")
        .attr("r", function(d) {
          return d;
        })
        .attr("stroke", "#039DFA")
        .attr("opacity", "0.4")
        .attr("fill", "none")
        .attr("cx", 0)
        .attr("cy", function(d) {
          return maxRadius - d;
        });
        
    legend.selectAll("line")
      .data(smallCircles)
      .enter().append("line")
      .attr("x1", 100)
      .attr("y1", 100)
      .attr("x2", lineEnd)
      .attr("y2", 100)
      .attr('stroke', 'black')
      .style('stroke-dasharray', ('2,2'));

   
});
