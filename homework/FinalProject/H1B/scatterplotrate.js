
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

d3.csv("h1bDenialRate.csv", function(error, data) {
console.log(data);

// var x = d3.scaleLinear()
var x = d3.scaleLinear()
    .domain([2008, 2019])
    // .domain(data.map(function(d) {return d.year; }))
    .range([0, width]);

// var x = d3.scaleTime()
//     .domain(d3.extent(data, function(d) { return data.year; }))
//     .range([ 0, width ]);


var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

//xAxis.d3.tickFormat(d3.format("d"));

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
        tooltip.html(`Denial rate: ${d.denialrate}<br> Total application: ${d.totalapplication}`)
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
    var valuesToShow = [200000, 300000, 400000]
    var xCircle = 390
    var xLabel = 440
      d3.select("#legend4")
      .data(valuesToShow)
      .enter()
      .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d){ return height - 100 - r(d) } )
        .attr("r", function(d){ return z(d) })
        .style("fill", "none")
        .attr("stroke", "black")

    // Add legend: segments
      d3.select("#legend4")
      .data(valuesToShow)
      .enter()
      .append("line")
        .attr('x1', function(d){ return xCircle + r(d) } )
        .attr('x2', xLabel)
        .attr('y1', function(d){ return height - 100 - z(d) } )
        .attr('y2', function(d){ return height - 100 - z(d) } )
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
      d3.select("#legend4")
      .data(valuesToShow)
      .enter()
      .append("text")
        .attr('x', xLabel)
        .attr('y', function(d){ return height - 100 - z(d) } )
        .text( function(d){ return d/1000000 } )
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    // Legend title
    svg.append("text")
      .attr('x', xCircle)
      .attr("y", height - 100 +30)
      .text("Population (M)")
      .attr("text-anchor", "middle")
        
});
