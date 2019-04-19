// Generate svg

var margin = {top: 60, right: 20, bottom: 60, left: 50};
    width = document.querySelector("#barchart").clientWidth;
    height = 650;

// var svg = d3.select("#barchart")
//     .append("svg")
//     .attr("width", width + margin.right + margin.left)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

var svg = d3.select("#barchart")
  .append("svg")
  .attr("width","100%")
  .attr("height", "100%")
  .attr('viewBox','-50 -50 1000 500')
  .attr('preserveAspectRatio','xMinYMin');

// Define data

var data = [
  {area: "Allston", calls: 0.486, calls2: 0.534},
  {area: "Downtown", calls: 0.323, calls2: 0.306},
  {area: "Mattapan", calls: 0.275, calls2: 0.295},
  {area: "Back Bay", calls: 0.262, calls2: 0.277},
  {area: "West Roxbury", calls: 0.245, calls2: 0.301},
  {area: "Beacon Hill", calls: 0.226, calls2: 0.377},
  {area: "Roslindale", calls: 0.217, calls2: 0.206},
  {area: "Jamaica Plain", calls: 0.201, calls2: 0.227},
  {area: "Roxbury", calls: 0.196, calls2: 0.238},
  {area: "South Boston", calls: 0.195, calls2: 0.197},
  {area: "Charlestown", calls: 0.190, calls2: 0.241},
  {area: "Hyde Park", calls: 0.182, calls2: 0.199},
  {area: "East Boston", calls: 0.169, calls2: 0.186},
  {area: "Dorchester", calls: 0.138, calls2: 0.143},
  {area: "South End", calls: 0.133,calls2: 0.151},
  {area: "Mission Hill", calls: 0.125, calls2: 0.155},
  {area: "Fenway", calls: 0.075, calls2: 0.135},
  {area: "Brighton", calls: 0.008, calls2: 0.011},
];


// Define scales

var xScale = d3.scaleBand()
    .domain(data.map(function(d) {return d.area; }))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.3);

var xScale1 = d3.scaleBand()
    .domain(['calls', 'calls2'])
    .range([0, xScale.bandwidth()])

var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){
      return d.calls > d.calls2 ? d.calls : d.calls2;
    })])
    .range([height - margin.bottom, margin.top]);

// Draw Axes

var xAxis = svg.append("g")
    .attr("class","axis")
    .call(d3.axisBottom(xScale))
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

var yAxis = svg.append("g")
    .attr("class","axis")
    .call(d3.axisLeft(yScale))
    .attr("transform", `translate(${margin.left}, 0)`);

// Draw Labels

var xLabel = svg.append("text")
  .attr("class", "axisLabel")
  .attr("x", width/2)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "middle")
  .text("Neighborhood");


var yLabel = svg.append("text")
  .attr("class", "axisLabel")
  .attr("transform", "rotate(-90)")
  .attr("y", -20)
  .attr("x", -height/2)
  .attr("text-anchor", "middle")
  .text("Number of Calls per Capita");

// Draw data
var area = svg.selectAll(".area")
    .data(data)
    .enter().append('g')
    .attr("class", "area")
    .attr("transform", d => `translate(${xScale(d.area)}, 0)`);

// Chart 1

var chart1 = area.selectAll(".bar.calls")
    .data(d => [d])
    .enter()
    .append("rect")
    .attr("class", "calls")
    .attr("x", function(d) {return xScale1('calls'); })
    .attr("y", height - margin.bottom)
    .attr("width", xScale1.bandwidth())
    .attr("height", 0)
    .attr("fill", "black")
    .on("mouseover", function(d,i) {
      d3.select(this).attr("fill", "#D3D3D3");
      tooltip.transition().duration(100)
      tooltip.html(`Year: <b>2012</b> <br> Call per capita: <b>${d.calls}</b>`)
      .style("left", d3.event.pageX + 10 + "px")
      .style("top", d3.event.pageY + 10 + "px")
      .style("opacity", 1)
      .style("font-size", "18px")
      .style("padding", "5px 8px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", "#00ccff")
      tooltip.html("")
      .style("padding", "0");
    });

// Chart 2

var chart2 = area.selectAll(".bar.calls2")
    .data(d => [d])
    .enter()
    .append("rect")
    .attr("class", "calls2")
    .attr("x", function(d) {return xScale1('calls2'); })
    .attr("y", height - margin.bottom)
    .attr("width", xScale1.bandwidth())
    .attr("height", 0)
    .attr("fill", "black")
    .on("mouseover", function(d,i) {
      d3.select(this).attr("fill", "#D3D3D3");
      tooltip.transition().duration(100)
      tooltip.html(`Year: <b>2018</b> <br> Call per capita: <b>${d.calls2}</b>`)
      .style("left", d3.event.pageX + 20 + "px")
      .style("top", d3.event.pageY + 20 + "px")
      .style("opacity", 1)
      .style("font-size", "18px")
      .style("padding", "5px 8px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", "#ffbb33")
      tooltip.html("")
      .style("padding", "0");
    });;


chart1.transition()
  .duration(1000)
  .attr("height", function(d) {return height - margin.bottom - yScale(d.calls);})
  .attr("y", function(d) {return yScale(d.calls); });


chart2.transition()
  .duration(1000)
  .attr("height", function(d) {return height - margin.bottom - yScale(d.calls2);})
  .attr("y", function(d) {return yScale(d.calls2); });

var bluerect = svg.append("rect")
                  .attr("x", 150)
                  .attr("y", 40)
                  .attr("width", 25)
                  .attr("height", 25)
                  .attr("fill", "#00ccff")
                  .attr("class", "legend");

var orangerect = svg.append("rect")
                  .attr("x", 500)
                  .attr("y", 40)
                  .attr("width", 25)
                  .attr("height", 25)
                  .attr("fill", "#ffbb33")
                  .attr("class", "legend");

var year12 = svg.append("text").text("2012")
                  .attr("x", 200)
                  .attr("y", 62)
                  .attr("fill", "#ffffff")
                  .attr("class", "legend");


var year18 = svg.append("text").text("2018")
                  .attr("x", 550)
                  .attr("y", 62)
                  .attr("fill", "#ffffff")
                  .attr("class", "legend");

// Draw tooltip
  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "#ccf5ff")
    .style("border-radius", "6px");
