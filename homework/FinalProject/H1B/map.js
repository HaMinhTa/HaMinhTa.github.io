var employerData;
    d3.csv("H1BEmployerBiggest.csv", function(error, data) {
        employerData = data;
    });

var employerData2;

    d3.csv("H1BEmployerMain.csv", function(error, data) {
        employerData2 = data;
        console.log(data);
    });


    var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "#ccf5ff")
            .style("border-radius", "6px");

        var width = window.innerWidth;
        var height = window.innerHeight;

        var svg = d3.select("#viz")
        .attr("width", width)
        .attr("height", height);

        svg.select("#ocean")
        .attr("width", width)
        .attr("height", height);

        var map = svg.select("#map");

        var zoom = d3.zoom()
        .translateExtent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed);
    
        function zoomed() {
            map.attr("transform", d3.event.transform);
        }

        svg.call(zoom)
        .on("dblclick.zoom", null);

        d3.json("USA.json", function(error, data) {           
        var geoJSON = data;

        var projection = d3.geoAlbersUsa()
            .fitSize([width/2, height/1.5], data);

        var path = d3.geoPath()
            .projection(projection);

        var states = map.selectAll("path")
            .data(geoJSON.features);

        states.enter().append("path")
            .attr("d", path)
            .attr("stroke","white")
            .attr("fill", function(d) {
                for (element of employerData2) {
                    if (element.State === d.properties.NAME) {
                        return fieldToColor(element.Category);
                    }
                }
            })
            .on("mouseover", function(d,i) {
                d3.select(this).style("opacity", "0.4");
                var stateName = d.properties.NAME;
                var employerName = employerData[0][`"${stateName}"`];  
                tooltip.transition().duration(100)
                tooltip.html(`<b>${stateName}:</b> ${employerName}`)
                .style("left", d3.event.pageX + 20 + "px")
                .style("top", d3.event.pageY + 20 + "px")
                .style("opacity", 1)
                .style("font-size", "16px")
                .style("padding", "8px 8px");
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

        });

            function fieldToColor(employerField) {
              if (employerField === "University") {
                    return "#ffc100";
                  } else if (employerField === "Health") {
                    return "#ff4d00";
                  } else if (employerField === "Technology") {
                    return "#ff7400";
                  } else if (employerField === "Consulting") {
                    return "#fcf0a2";
                  } else {
                    return "#9e5105";
                  }
            }