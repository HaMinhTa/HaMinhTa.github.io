// var width = document.querySelector("#linechart").clientWidth;

var margin = {top: 20, left: 100, right: 20, bottom: 60};
var width = 1200 - margin.left - margin.right;
var height = 700 - margin.top - margin.bottom;

var svg = d3.select("#linechart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
  // .attr('viewBox','50 50 1000 800')
  // .attr('preserveAspectRatio','xMinYMin');
  											
var data = [
  {year: 2009, receipt: 253543, approval: 26066},
  {year: 2010, receipt: 205495, approval: 12522},
  {year: 2011, receipt: 283180, approval: 13131},
  {year: 2012, receipt: 281261, approval: 11429},
  {year: 2013, receipt: 309422, approval: 14148},
  {year: 2014, receipt: 349571, approval: 16765},
  {year: 2015, receipt: 301575, approval: 13073},
  {year: 2016, receipt: 380244, approval: 23032},
  {year: 2017, receipt: 403251, approval: 29856},
  {year: 2018, receipt: 396307, approval: 61346},
  {year: 2019, receipt: 458836, approval: 69513}
];

var xScale = d3.scaleLinear()
  .domain([2007,2017])
  .range([margin.left, width-margin.right]);

var yScale = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) {
    return Math.max(d.receipt, d.approval);
  })])
  .range([height-margin.bottom, margin.top]);


var xAxis = svg.append("g")
  .attr("class","axis")
  .attr("transform",`translate(0,${height-margin.bottom})`)
  .call(d3.axisBottom().scale(xScale).ticks(11, "f"));


var yAxis = svg.append("g")
  .attr("class","axis")
  .attr("transform",`translate(${margin.left},0)`)
  .call(d3.axisLeft().scale(yScale));

var line = d3.line()
  .x(function(d) { return xScale(d.year); })
  .y(function(d) { return yScale(d.receipt); })
  .curve(d3.curveCardinal);

var line2 = d3.line()
  .x(function(d) { return xScale(d.year); })
  .y(function(d) { return yScale(d.approval); })
  .curve(d3.curveCardinal);

var path = svg.append("path")
  .datum(data)
  .attr("d", line)
  .attr("stroke","#00ccff")
  .attr("stroke-width",4)
  .attr("fill","none");

var path2 = svg.append("path")
  .datum(data)
  .attr("d", line2)
  .attr("stroke","#ffbb33")
  .attr("stroke-width",4)
  .attr("fill","none");

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position","absolute")
  .style("background", "#ccf5ff");


var circle = svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return xScale(d.year); })
    .attr("cy", function(d) { return yScale(d.receipt); })
    .attr("r", 8)
    .attr("class", "circle")
    .attr("fill","#00ccff")
    .attr("stroke","#FFFFFF")
    .attr("stroke-width",2)
    .on("mouseover", function(d,i) {
      d3.select(this).attr("fill","#b50418").attr("r",12)
      tooltip.transition().duration(100)
      tooltip.html(`<b>${d.receipt}</b> receipts`)
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

var circle2 = svg.selectAll("circle2")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return xScale(d.year); })
    .attr("cy", function(d) { return yScale(d.approval); })
    .attr("r", 8)
    .attr("class", "circle")
    .attr("fill", "#ffbb33")
    .attr("stroke","#FFFFFF")
    .attr("stroke-width",2)
    .on("mouseover", function(d,i) {
      d3.select(this).attr("fill","#b50418").attr("r",12)
      tooltip.transition().duration(100)
      tooltip.html(`<b>${d.approval}</b> approvals`)
      .style("left", d3.event.pageX - 50 + "px")
      .style("top", d3.event.pageY - 50 + "px")
      .style("opacity", 1)
      .style("padding", "8px 10px")
      .style("border-radius", "5px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill","#ffbb33").attr("r",8)
      tooltip.html("")
      .style("padding", "0");
    });

var xLabel = svg.append("text")
  .attr("class","axisLabel")
  .attr("x",width/2)
  .attr("y", height - 10)
  .attr("text-anchor","middle")
  .attr("font-weight", "bold")
  .text("Year");

var yLabel = svg.append("text")
  .attr("class","axisLabel")
  .attr("y", 20)
  .attr("x", -height/2 -60)
  .attr("text-anchor","middle")
  .attr("transform","rotate(-90)")
  .attr("font-weight", "bold")
  .text("Number of Petitions");


var bluerect = svg.append("rect")
                  .attr("x", width/1.5)
                  .attr("y", height/1.56)
                  .attr("width", 25)
                  .attr("height", 25)
                  .attr("fill", "#00ccff")
                  .attr("class", "legend");

var orangerect = svg.append("rect")
                  .attr("x", width/1.2)
                  .attr("y", height/1.56)
                  .attr("width", 25)
                  .attr("height", 25)
                  .attr("fill", "#ffbb33")
                  .attr("class", "legend");

var receipts = svg.append("text").text("Received")
                  .attr("x", width/1.41)
                  .attr("y", height/1.5)
                  .attr("fill", "black")
                  .attr("class", "legend");


var approvals = svg.append("text").text("Approved")
                  .attr("x", width/1.14)
                  .attr("y", height/1.5)
                  .attr("fill", "black")
                  .attr("class", "legend");
