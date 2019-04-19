var margin = {top: 20, right: 20, bottom: 20, left: 20};
    width = 800 - margin.right - margin.left;
    height = 600 - margin.top - margin.bottom;

// var svg = d3.select("#balloonchart")
//     .append("svg")
//     .attr("width", width + margin.right + margin.left)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

var svg = d3.select("#balloonchart")
   .append("svg")
   .attr("width","100%")
   .attr("height", "100%")
   .attr('viewBox','-50 -50 800 600')
   .attr('preserveAspectRatio','xMinYMin');

var circle = svg.append("circle")
  .attr("class","animateCircle")
  .attr("cx", width/3)
  .attr("cy", height-50)
  .attr("r", 30)
  .attr("fill","#ffb84d")
  .attr("stroke-width", 1)
  .on("mouseover", function(d,i) {
    d3.select(this).attr("fill", "grey")
    tooltip.transition().duration(100)
    tooltip.html("2018: 14983 calls")
    .style("left", d3.event.pageX - 50 + "px")
    .style("top", d3.event.pageY - 50 + "px")
    .style("opacity", 1)
    .style("padding", "12px 14px");
  })
  .on("mouseout", function() {
    d3.select(this).attr("fill", "#8dd4dc")
    tooltip.html("")
    .style("padding", "0");
  });

var circle2 = svg.append("circle")
  .attr("cx", width/3)
  .attr("cy", height-50)
  .attr("r", 30)
  .attr("fill","#00ccff")
  .on("mouseover", function(d,i) {
    d3.select(this).attr("fill", "#D3D3D3")
    tooltip.transition().duration(100)
    tooltip.html("2012: 16 calls")
    .style("left", d3.event.pageX - 50 + "px")
    .style("top", d3.event.pageY - 50 + "px")
    .style("opacity", 1)
    .style("padding", "6px 8px");
  })
  .on("mouseout", function() {
    d3.select(this).attr("fill", "#00ccff")
    tooltip.html("")
    .style("padding", "0");
  });

// circle
//   .transition()
//   .duration(2500)
//   .delay(20)
//   .attr("cx",width/2)
//   .attr("cy",height/2+20)
//   .style("fill","orange")
//   .attr("r",280);

function animateValue(id, end) {
var current = 0;
var increment = 50;
var stepTime = 1;
var obj = document.getElementById(id);
var timer = setInterval(function() {
    current += increment;
    obj.innerHTML = current;
    if (current === 14900) {
      increment = 1;
    }
    if (current >= end) {
        clearInterval(timer);
        }
    }, stepTime);
  }

// var number = svg.append("text").text("")
//   .attr("x", width/3)
//   .attr("y", height-50)
//   .attr("text-anchor", "middle")
//   .attr("fill", "black")
//   .attr("font-weight", "bold");
//
// var number2 = svg.append("#value")
//   .attr("x", 550)
//   .attr("y", height/2 + 100);

var text = svg.append("text").text("CODE ENFORCEMENT CALLS 2018")
  .attr("x", width/4)
  .attr("y", height/2 + 30)
  .attr("fill", "white")
  .attr("font-size", "25px")
  .attr("font-family", "Helvetica")
  .attr("font-weight");

var text2 = svg.append("text").text("2012")
  .attr("x", width/3 - 20)
  .attr("y", height-50)
  .attr("font-size", "18px")
  .attr("font-family", "Helvetica")
  .attr("fill", "white");


// animateValue("value", 14983);

// var  = d3.select("body")
//   .append("div")
//   .attr("class", "tooltip")
//   .style("position", "absolute")
//   .style("background", "yellow");
