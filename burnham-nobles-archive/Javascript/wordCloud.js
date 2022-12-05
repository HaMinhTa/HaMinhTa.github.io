var rellax = new Rellax('.rellax');

let width = window.innerWidth;
let height = window.innerHeight;


let svgWordBoard = d3.select("#dataViz")
    .attr("width", width)
    .attr("height", height);

d3.csv("Data/personData.csv", function (personData) {
    let nameList = [];
    for (const person of personData) {
        nameList.push({ name: person.Name, ID: person.ID })
    }

    var color = d3.scaleLinear()
        .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
        .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

    d3.layout.cloud().size([width, height])
        .words(nameList)
        .rotate(0)
        .fontSize(30)
        .on("end", draw)
        .start();

    function draw(words) {
        var text = svgWordBoard.attr("class", "wordcloud")
            .append("g")
            // without the transform, words would get cutoff to the left and top, they would
            // appear outside of the SVG area
            .attr("transform", "translate(650,400)")
            .selectAll("text")
            .data(words)
            .enter()
            .append("a")
            .attr("xlink:href", d => "https://crrjarchive.org/people/" + d.ID, '_blank')
            .append("text")
            .attr("class", "names")
            // .style("fill", function(d, i) { return color(i); })
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.name; });
        // .on("end", function() { d3.select(this).style("opacity", "0.5"); })
        text.transition()
            .delay(function (d, i) { return 150 * i; })
            .duration(3000)
            .style("fill", "white");

        // text.on("mouseover", function (d, i) {
        //     d3.select(this)
        //         .style("opacity", 0.5)
        //     tooltip.html("<i>Click to learn about the life and death <br> of <strong>" + d.name + "</strong></i>")
        //         .style("left", d3.event.pageX + 10 + "px")
        //         .style("top", d3.event.pageY + 10 + "px")
        //         .style("padding", "10px 10px");
        // })
        //     .on("mouseout", function () {
        //         d3.select(this).style("opacity", 1)
        //         tooltip.html("")
        //             .style("padding", "0");
        //     })
    }
});