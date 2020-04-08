var WAYPOINT = new Waypoint({
    element: document.querySelector("#trigger1"),
    handler: function(direction) {
      if (direction === "down") {
        d3.selectAll("#viz > *").remove();
        d3.queue()
            .defer(d3.csv, "H1BEmployerMain.csv")
            .defer(d3.json, "USA.json")
            .await(drawMap);
        function drawMap(error, h1bData, geoData) {
            d3.select("#chart1Title").text("Which States Give the Most H1B Visas?")

            var projection = d3.geoAlbersUsa()
              .fitSize([width, height], geoData);
          
            var path = d3.geoPath()
                .projection(projection);
          
            var maximum = d3.max(h1bData, function(d) {
                return parseInt(d.totalapprovals);
              });
            
            let color = d3.scaleLinear().domain([0, maximum]).range(["#89d8fa", "#024b6b"]).interpolate(d3.interpolate);
          
            var states = d3.select("svg").selectAll("path")
                .data(geoData.features);
          
            console.log(h1bData);
          
            let abbrv = { 'Alabama': "AL", 'Alaska': "AK", 'Arizona': "AZ", 'Arkansas': "AR", 'California': "CA", 'Colorado': "CO", 'Connecticut': "CT", 'Delaware': "DE", 'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire':	 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota':	'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon':	 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'WestVirginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'};
            
                states.enter().append("path")
                    .attr("d", path)
                    .attr("stroke","white")
                    .attr("fill", function(d) {
                        for (element of h1bData) {
                            if (element.state === d.properties.NAME) {
                                return color(element.totalapprovals);
                            }
                        }
                    })
                    .on("mouseover", function(d, i) {
                        d3.select(this).style("opacity", "0.4");
                        var state = d.properties.NAME;
                        var approvals = findApproval(state, h1bData);
                        tooltip.transition().duration(100)
                        tooltip.html(`<b>${state}:</b> ${approvals} approvals`)
                        .attr("class", "tooltipText")
                        .style("left", d3.event.pageX + 20 + "px")
                        .style("top", d3.event.pageY + 20 + "px")
                        .style("opacity", 0.8)
                        .style("padding", "8px 10px");
          
                    })
                    .on("mouseout", function() {
                        d3.select(this).style("opacity", "1")
                        tooltip.html("")
                        .style("padding", "0");
                    });
          
                    d3.select("svg").selectAll("text")
                    .data(geoData.features)
                    .enter()
                    .append("text")
                    .text(function(d){
                      let stateName = d.properties.NAME;
                      if (abbrv[stateName]) {
                        return abbrv[stateName];
                      } else {
                        return "";
                      }
                    })
                      .attr("text-anchor", "middle")
                      .attr("class", "mapText")
                      .attr("x", d => {
                        return path.centroid(d)[0];
                      })
                      .attr("y", d => path.centroid(d)[1]);

                      function findApproval(stateToFind, allStates) {
                        for (state of allStates) {
                          if (state.state === stateToFind) {
                            return state.totalapprovals;
                          }
                        }
                      }
          };
      } else if(direction === "up") {

        d3.queue()
        .defer(d3.csv, "H1BEmployerMain.csv")
        .defer(d3.json, "USA.json")
        .await(drawMap);

        function drawMap(error, h1bData, geoData) {
          var projection = d3.geoAlbersUsa()
            .fitSize([width, height], geoData);
        
          var path = d3.geoPath()
              .projection(projection);
        
          var states = d3.select("svg").selectAll("path")
              .data(geoData.features);
        
              states.enter().append("path")
                  .attr("d", path)
                  .attr("stroke","black")
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
                      tooltip.html("")
                      .style("padding", "0");
                  });
        }
        
      }
    }
  });
  