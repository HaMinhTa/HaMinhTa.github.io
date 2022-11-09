var WAYPOINT = new Waypoint({
    element: document.querySelector("#trigger1"),
    handler: function (direction) {
        if (direction === "down") {
            let map = svg.select("#map");

            let southernStateFeatures = mapData.features.filter(d => southernStates.has(stateName(d)));
            let southernStateFeatureCollection = { "type": "FeatureCollection", "features": southernStateFeatures };

            let proj = d3.geoAlbersUsa()
                .fitSize([width, height], southernStateFeatureCollection);

            let path = d3.geoPath()
                .projection(proj);

            svg.append("circle").attr("cx", xValueofLegendCircle).attr("cy", 50).attr("r", 6).style("fill", initialDotColorPolice)
            svg.append("circle").attr("cx", xValueofLegendCircle).attr("cy", 80).attr("r", 6).style("fill", initialDotColorCivilian)
            svg.append("text").attr("x", xValueofLegendText).attr("y", 50).text("Killed by Law Enforcemennt").attr("class", "legendText").attr("alignment-baseline", "middle")
            svg.append("text").attr("x", xValueofLegendText).attr("y", 80).text("Killed by Civilian").attr("class", "legendText").attr("alignment-baseline", "middle")


            map.selectAll("path")
                .data(southernStateFeatures)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("stroke", "#B6B5B5")
                .attr("fill", getStateColor)
                .style("opacity", "1");

            map.selectAll("text")
                .data(mapData.features)
                .enter()
                .append("text")
                .text(function (d) {
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
            }
        }
    })