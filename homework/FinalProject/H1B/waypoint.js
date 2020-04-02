var WAYPOINT = new Waypoint({
    element: document.querySelector("#trigger1"),
    handler: function(direction) {
      if(direction === "down") {
        d3.queue()
        .defer(d3.csv, "H1BEmployerMain.csv")
        .defer(d3.json, "USA.json")
        .await(drawMap);
        function drawMap(error, h1bData, geoData) {
            var projection = d3.geoAlbersUsa()
              .fitSize([width, height], geoData);
          
            var path = d3.geoPath()
                .projection(projection);
          
            var states = map.selectAll("path")
                .data(geoData.features);
          
                states.enter().append("path")
                    .attr("d", path)
                    .attr("stroke","black")
                    // .attr("fill", function(d) {
                    //     for (element of h1bData) {
                    //         if (element.state === d.properties.NAME) {
                    //             return fieldToColor(element.category);
                    //         }
                    //     }
                    // })
                    .attr("fill", d => {
                      let state = d.properties.NAME.split(" ").join("");
                      let id = `${state}Logo`;
                      return `url(#${id})`;
                    })
                    .on("mouseover", function(d, i) {
                        d3.select(this).style("opacity", "0.9");
                        var state = d.properties.NAME;
                        var employer = findEmployer(state, h1bData);
                        tooltip.transition().duration(100)
                        tooltip.html(`<b>${state}:</b> ${employer}`)
                        .attr("class", "tooltipText")
                        .style("left", d3.event.pageX + 20 + "px")
                        .style("top", d3.event.pageY + 20 + "px")
                        .style("opacity", 0.8)
                        .style("padding", "6px 10px");
                    })
                    .on("mouseout", function() {
                        d3.select(this).style("opacity", "1")
                        // .attr("fill", function(d) {
                        //   var employerField = employerData[2][`"${d.properties.NAME}"`];
                        //   return fieldToColor(employerField);
                        // })
                        tooltip.html("")
                        .style("padding", "0");
                    });
          }
          
      } else if(direction === "up") {}
    }
  });
  
  
  
  
  var WAYPOINT1 = new Waypoint({
    element: document.querySelector("#trigger2"),
    handler: function(direction) {
      if(direction === "down") {
        document.querySelector("#barchart")
        chart.transition()
          .delay(200)
          .attr("height", function(d) {return height - margin.bottom - yScale(d.spaces);})
          .attr("y", function(d) {return yScale(d.spaces); })
          .delay(function(d,i) {
            return i * 100;
          });
      } else if(direction === "up") {}
    }
  });
  