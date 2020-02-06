var realtimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/random";
var frequency = 1 * 1000; // 1 seconds

var dataMax = 5;
var data = [];

var margin = {top: 80, right: 50, bottom: 60, left: 50};
var width = window.innerWidth - margin.left - margin.right;
var height = window.innerHeight - margin.top - margin.bottom;

var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
        return barHeight(d.users);
      })
      .attr("x", function(d, i) {
        return x(i + 1);
      });

    bars.exit()
      .transition().duration(frequency / 2)
      .attr("height", 0)
      .attr("y", height)
      .remove();


    var fontSize = 20;

    var labels = svg.selectAll(".label")
      .data(data, function(d) {
        return d.timestamp;
      });

    var enterLabels = labels.enter().append("text")
      .attr("class", "label")
      .attr("font-size", fontSize)
      .attr("fill", "white")
      .attr("baseline-shift", "-100%")
      .attr("y", height)
      .attr("x", function(d, i) {
        return x(i + 1);
      })
      .attr("width", barWidth);

    labels.merge(enterLabels)
      .transition().duration(frequency / 2)
      .each(function(d,i) {
        var textElement = d3.select(this);
        textElement.text(" ");

        var currLabel = d.users + " users on the site";
        var words = currLabel.split(" ");

        var tspan = textElement.append("tspan")
          .attr("x", x(i+1))
          .attr("y", barHeight(d.users))
          .attr("baseline-shift", "-100%");
        var line = 0;

        words.forEach(function(word) {
          var sentence = tspan.text();
          tspan.text(sentence + " " + word);
          var lineWidth = tspan.node().getBoundingClientRect().width;

          if (lineWidth > barWidth) {
            line++;
            tspan.text(sentence);
            tspan = textElement.append("tspan")
              .attr("baseline-shift", "-100%")
              .attr("y", barHeight(d.users) + (fontSize * line))
              .attr("x", x(i + 1))
              .text(word);

          }
        });
      })
      .attr("y", function(d) {
        return barHeight(d.users);
      })
      .attr("x", function(d, i) {
        return x(i + 1);
      });

    labels.exit().remove();
  });
}

fetchData();
setInterval(fetchData, frequency);
