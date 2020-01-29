var realtimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/random";
var frequency = 1 * 1000; // 1 seconds

var dataMax = 5;
var data = [];

var margin = {top: 60, right: 20, bottom: 90, left: 50};
var width = window.innerWidth - margin.left - margin.right;
var height = window.innerHeight - margin.top - margin.bottom;

var svg = d3.select("#chart")
  .attr("width", width)
  .attr("height", height);

var barWidth = width / dataMax / 2;

var x = d3.scaleLinear()
  .domain([dataMax, 1])
  .range([margin.left, width - barWidth]);

var barHeight = d3.scaleLinear()
  .range([height, 0]);

var yAxis = svg.append("g")
  .attr("class", "axis")
  .attr("transform", `translate(${margin.left}, 0)`);

function fetchData() {

  d3.json(realtimeURL, function(error, users) {

    var dataObject = {
      users: users,
      timestamp: new Date()
    };

    data.unshift(dataObject);
    if (data.length > dataMax) data.pop();
    console.log(data);

    var maximum = d3.max(data, function(d) {
      return d.users;
    });

    barHeight.domain([0, maximum]);
    yAxis.transition().duration(500)
      .call(d3.axisLeft(barHeight));

    var bars = svg.selectAll(".bar")
      .data(data, function(d) {
        return d.timestamp;
      });

    var enter = bars.enter().append("rect")
      .attr("class", "bar")
      .attr("fill", "#8933ab")
      .attr("width", barWidth)
      .attr("height", 0)
      .attr("y", height)
      .attr("x", function(d, i) {
        return x(i + 1);
      });

    bars.merge(enter)
      .transition().duration(frequency / 2)
      .attr("height", function(d) {
        return height - barHeight(d.users);
      })
      .attr("y", function(d) {
        var h = barHeight(d.users);
        return h;
      })
      .attr("x", function(d, i) {
        return x(i + 1);
      });

    bars.exit()
      .transition().duration(frequency / 2)
      .attr("height", 0)
      .attr("y", height)
      .remove();

  });

}

fetchData();
setInterval(fetchData, frequency);
