var width = document.querySelector("#linechart").clientWidth;
var height = 700;
var margin = {top: 200, left: 100, right: 25, bottom: 70};

// var svg = d3.select("#linechart")
//   .append("svg")
//   .attr("width", width)
//   .attr("height", height);

var svg = d3.select("#linechart")
  .append("svg")
  .attr("width","100%")
  .attr("height", "100%")
  .attr('viewBox','-50 -50 1050 600')
  .attr('preserveAspectRatio','xMinYMin');

var data = [
  {year: 2012, calls: 117832},
  {year: 2013, calls: 143174},
  {year: 2014, calls: 149061},
  {year: 2015, calls: 194676},
  {year: 2016, calls: 109732},
  {year: 2017, calls: 125865},
  {year: 2018, calls: 131604}
];

var xScale = d3.scaleLinear()
  .domain([2012,2018])
  .range([margin.left, width-margin.right]);

var yScale = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) {
    return d.calls;
  })])
  .range([height-margin.bottom, margin.top]);

var xAxis = svg.append("g")
  .attr("class","axis")
  .attr("transform",`translate(0,${height-margin.bottom})`)
  .call(d3.axisBottom().scale(xScale).ticks(7, "f"));


var yAxis = svg.append("g")
  .attr("class","axis")
  .attr("transform",`translate(${margin.left},0)`)
  .call(d3.axisLeft().scale(yScale));

var line = d3.line()
  .x(function(d) { return xScale(d.year); })
  .y(function(d) { return yScale(d.calls); })
  .curve(d3.curveCardinal);

var path = svg.append("path")
  .datum(data)
  .attr("d", line)
  .attr("stroke","#00ccff")
  .attr("stroke-width",4)
  .attr("fill","none");

var circle = svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return xScale(d.year); })
    .attr("cy", function(d) { return yScale(d.calls); })
    .attr("r", 8)
    .attr("class", "circle")
    .attr("fill","#00ccff")
    .attr("stroke","#FFFFFF")
    .attr("stroke-width",2)
    .on("mouseover", function(d,i) {
      d3.select(this).attr("fill","orange").attr("r",12)
      tooltip.transition().duration(100)
      tooltip.html(`<b>${d.calls}</b> calls`)
      .style("left", d3.event.pageX - 50 + "px")
      .style("top", d3.event.pageY - 50 + "px")
      .style("opacity", 1)
      .style("padding", "8px 10px")
      .style("border-radius", "5px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill","#00ccff").attr("r",8)
      tooltip.html("")
      .style("padding", "0");
    });

var xLabel = svg.append("text")
  .attr("class","axisLabel")
  .attr("x",width/2)
  .attr("y", height - 10)
  .attr("text-anchor","middle")
  .text("Year");

var yLabel = svg.append("text")
  .attr("class","axisLabel")
  .attr("y", 20)
  .attr("x", -height/2 -60)
  .attr("text-anchor","middle")
  .attr("transform","rotate(-90)")
  .text("Number of Requests");
