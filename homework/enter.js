let svg = d3.select("#test")
    .attr("width", 1000)
    .attr("height", 800);

let circle = svg.selectAll("circle")
    .data([4, 8, 10])
    .exit()
    .remove("circle");
// let circleEnter = circle.enter().append("circle");

// circle.attr("cy", 100);

// circleEnter.attr("cy", 100)
//     .attr("r", function(d) {return d*5;})
//     .attr("cx", function(d, i) {return i*200 +25;});