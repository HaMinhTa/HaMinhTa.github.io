/*

Template for Waypoint trigger:

var WAYPOINT = new Waypoint({
  element: document.querySelector(SELECTION),
  handler: function(direction) {
    if(direction === "down") {

      <-- ACTION GOES HERE FOR DOWNWARD SCROLLING-->

    } else if(direction === "up") {

      <-- ACTION GOES HERE FOR UPWARD SCROLLING -->

    }
  }
});

*/

/* ----- BARCHART 2012 CALLS ----- */
var WAYPOINT1 = new Waypoint({
  element: document.querySelector("#triggerBarChart2012"),
  handler: function(direction) {
    if(direction === "down") {
    d3.selectAll(".calls")
      .transition()
      .attr("fill", "#00ccff")
    } else if(direction === "up") {
    d3.selectAll(".calls")
      .attr("fill", "black")
    }
  }
});

/* ----- BARCHART 2018 CALLS ----- */
var WAYPOINT1b = new Waypoint({
  element: document.querySelector("#triggerBarChart2018"),
  offset: 500,
  handler: function(direction) {
    if(direction === "down") {
    d3.selectAll(".calls2")
      .transition()
      .attr("fill", "#ffbb33")
    } else if (direction === "up") {
    d3.selectAll(".calls2")
      .attr("fill", "black")
    }
  }
});

var WAYPOINT1c = new Waypoint({
  element: document.querySelector("#triggerBarChartAllston"),
  offset: 500,
  handler: function(direction) {
    if (direction === "down") {
      d3.selectAll(".calls")
        .style("opacity", function(d) {
          if (d.area === "Allston" || d.area === "Brighton") {
            return "1";
          } else {
            return "0.2";
          }
        });
      d3.selectAll(".calls2")
        .style("opacity", function(d) {
          if (d.area === "Allston" || d.area === "Brighton") {
            return "1"
          } else {
            return "0.2";
          }
        });
    } else {
      d3.selectAll(".calls")
        .style("opacity", "1");
      d3.selectAll(".calls2")
        .style("opacity", "1");
    }
  }
});

/* ----- LINECHART ----- */
var WAYPOINT2 = new Waypoint({
  element: document.querySelector("#triggerLineChart"),
  offset: 100,
  handler: function(direction) {
    if(direction === "down") {
    d3.selectAll(".circle")
      .attr("r", function(d) {
        if (d.year === 2015) {
          return "15";
        } else {
          return "8";
        }
      })
      .attr("stroke-width", function(d) {
        if (d.year === 2015) {
          return "4";
        } else {
          return "1";
        }
      })
      .attr("fill", function(d) {
        if (d.year === 2015) {
          return "orange";
        } else {
          return "#00ccff";
        }
      })
    } else if(direction === "up") {
    d3.selectAll(".circle")
      .attr("r", "8")
      .attr("stroke-width", "1")
      .attr("fill", "#00ccff")
      }
}
});

var seen = false;

/* ----- PIE CHART ----- */
var WAYPOINT3 = new Waypoint({
    element: document.querySelector("#triggerPieChart"),
    handler: function(direction) {
        if (direction === "down" && seen === false) {
            var width = document.querySelector("#barchart").clientWidth;
            seen = true;
            var pie = new d3pie("piechart", {
                "header": {
                    "title": {
                        "text": "Boston 311 Medium of Calls",
                        "color": "#fdfdfd",
                        "fontSize": 26,
                        "font": "georgia"
                    },
                    "subtitle": {
                        "color": "#999999",
                        "fontSize": 12,
                        "font": "open sans"
                    },
                    "titleSubtitlePadding": 16
                },
                "footer": {
                    "color": "#999999",
                    "fontSize": 10,
                    "font": "open sans",
                    "location": "bottom-left"
                },
                "size": {
                    "canvasHeight": 800,
                    "canvasWidth": 800,
                    "pieOuterRadius": "90%"
                },
                "data": {
                    "sortOrder": "value-desc",
                    "content": [{
                            "label": "Citizen Connect App",
                            "value": 330570,
                            "color": "#00c9ff"
                        },
                        {
                            "label": "City Worker App",
                            "value": 110319,
                            "color": "#128bd7"
                        },
                        {
                            "label": "Constituent Calls",
                            "value": 459601,
                            "color": "#ffbb33"
                        },
                        {
                            "label": "Employee Generated",
                            "value": 72299,
                            "color": "#2661d6"
                        },
                        {
                            "label": "Self Service",
                            "value": 70124,
                            "color": "#e88829"
                        },
                        {
                            "label": "Twitter",
                            "value": 1558,
                            "color": "#f91904"
                        }
                    ]
                },
                "labels": {
                    "outer": {
                        "pieDistance": 20
                    },
                    "inner": {
                        "hideWhenLessThanPercentage": 3
                    },
                    "mainLabel": {
                        "color": "#ffffff",
                        "fontSize": 16
                    },
                    "percentage": {
                        "color": "#ffffff",
                        "fontSize": 18,
                        "decimalPlaces": 0
                    },
                    "value": {
                        "color": "#adadad",
                        "fontSize": 14
                    },
                    "lines": {
                        "enabled": true
                    },
                    "truncation": {
                        "enabled": true
                    }
                },
                "tooltips": {
                    "enabled": true,
                    "type": "placeholder",
                    "string": "{label}: {value}, {percentage}%",
                    "styles": {
                        "borderRadius": 4,
                        "fontSize": 14,
                        "padding": 8
                    }
                },
                "effects": {
                    "pullOutSegmentOnClick": {
                        "effect": "linear",
                        "speed": 400,
                        "size": 8
                    }
                },
                "callbacks": {}
            });
            d3.select("#piechart").select("svg")
              .attr("width","100%")
              .attr("height","100%")
              .attr("viewBox", "-100 -50 1000 1000")
              .attr("preserveAspectRatio", "xMinYMin");
        } else {}
    }
});

/* ----- BUBBLE CHART ----- */
var WAYPOINT4 = new Waypoint({
  element: document.querySelector("#triggerBubbleChart"),
  offset: 100,
  handler: function(direction) {
    if(direction === "down") {
      noCategorization();
    } else if(direction === "up") {
      noCategorization();
    }
  }
});

/* ----- BUBBLE CHART CATEGORIZE BY YEAR ----- */
var WAYPOINT4b = new Waypoint({
  element: document.querySelector("#triggerBubbleChartYear"),
  offset: 100,
  handler: function(direction) {
    if(direction === "down") {
      categorizeByYear();
    } else if(direction === "up") {
      categorizeByYear();
    }
  }
});

/* ----- BUBBLE CHART CATEGORIZE BY TYPE */
var WAYPOINT4c = new Waypoint({
  element: document.querySelector("#triggerBubbleChartType"),
  offset: 100,
  handler: function(direction) {
    if(direction === "down") {
      categorizeByType();
    } else if(direction === "up") {
      categorizeByType();
    }
  }
});

/* ----- BALLOON CHART ----- */
var WAYPOINT6 = new Waypoint({
  element: document.querySelector("#triggerBalloonChart"),
  offset: 100,
  handler: function(direction) {
    if(direction === "down") {
      circle
        .transition()
        .delay(1000)
        .duration(2500)
        .attr("cx",width/2)
        .attr("cy",height/2+20)
        .style("fill","orange")
        .attr("r",280)
    } else if(direction === "up") {
      circle
        .transition()
        .attr("r",0)
    }
  }
});
