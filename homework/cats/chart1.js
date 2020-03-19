d3.select("#chart1")
  .on("mousemove", function() {

    console.log(d3.event);

});

d3.select("#linechart")
  .on("mousemove", function() {
    d3.select("#tooltip")
      .style("display", "block")
      .style("top", d3.event.pageY + 20 + "px")
      .style("left", d3.event.pageX + 20 + "px")
      .html("Welcome to the first chart!");
});

d3.select("#linechart")
  .on("mousemove", function() {
    d3.select("#tooltip")
      .style("display", "block")
      .style("top", d3.event.pageY + 20 + "px")
      .style("left", d3.event.pageX + 20 + "px")
      .html("Welcome to the first chart!");
  })
  .on("mouseout", function() {
    d3.select("#tooltip")
      .style("display", "none");
});