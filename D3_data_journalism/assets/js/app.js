// Define SVG area dimensions
var svgWidth = 800;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 60,
    left: 120
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

//create g tag container for chart area
var chartGroup = svg.append("g").attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

//read in file and fulfill promise
d3.csv("assets/data/data.csv").then(function (ogData) {
    console.log(ogData)
    //transform data types
    ogData.forEach(function (d) {
        d.poverty = +d.poverty
        d.obesity = +d.obesity
    });
    console.log(ogData)

    //define x axis scaling
    var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(ogData, d => d.obesity) + 2]) //range of obesity values
        .range([0, chartWidth]); //from zero to end of chart

    // define y axis scaling
    var yLinearScale = d3.scaleLinear()
        .domain([6, d3.max(ogData, d => d.poverty) + 2]) //range of povery values
        .range([chartHeight, 0]); // chartHeight piels down the svg area to zero

    // create scaled axis variables
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axes to chart
    chartGroup
        .append("g") //create g container for left axis
        .call(leftAxis)
        .classed("axis", true) //for css styling
    chartGroup
        .append("g") //create g container for botoom axis
        .classed("axis", true) //for css styling
        .attr("transform", `translate(0, ${chartHeight})`) //move from top to bottom of chart
        .call(bottomAxis);

    
    //create a circle tag for each data object
    chartGroup
        .append("g") //create g container for circles
        .classed("scatterpoints", true)

    var scatterPoints = chartGroup.select(".scatterpoints").selectAll("circle")
        .data(ogData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.obesity)) //set cx coord to scaled obesity data
        .attr("cy", d => yLinearScale(d.poverty)) //set cy coord to scaled poverty data
        .attr("r", 12) //size of points
        .attr("fill", "#00cccc")

    //create text inside of each scatter point
    chartGroup
        .append("g") //create g container for circle text tags
        .classed("scatterpoint-text", true)

    var circleText = chartGroup.select(".scatterpoint-text").selectAll("text")
        .data(ogData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.obesity))
        .attr("y", d => yLinearScale(d.poverty))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("stroke", "black")
        .attr("stroke-width", .5)
        .text(d => d.abbr)
        .classed("scatterpoint-text", true)


    //Tool tips
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([75, 45])
        .html(function (d) {
            return (`${d.state} <br> Poverty: ${d.poverty}% <br> Obesity: ${d.obesity}%`)
        });
    chartGroup.call(toolTip)

    console.log(scatterPoints)

    circleText
        .on("mouseover", function (d) {
        toolTip.show(d, this)
    });
    circleText
        .on("mouseout", function (d) {
        toolTip.hide(d)
    });
    //=================================


    //X Axis Label
    chartGroup
        .append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 20})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .text("Obesity Rate");
    //Y Axis Label
    chartGroup
        .select(".axis")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .attr("x", -(chartHeight / 2))
        .attr("y", -(chartMargin.left / 2))
        .text("Poverty Rate");
    chartGroup
        .select(".axis")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .attr("x", -(chartHeight / 2))
        .attr("y", -(chartMargin.left / 2) - 30)
        .text("Smoking Rate")
        .classed("smoking-axis", true);
});

/*
smokingAxis = d3.select(".axis")
console.log(smokingAxis)
smokingAxis.on("click", newYaxisData)

function newYaxisData() {
    d3.csv("assets/data/data.csv").then(function (ogData) {
        console.log(ogData)
        //transform data types
        ogData.forEach(function (d) {
            //convert to nummeric
            d.smokes = +d.smokes
        });
        console.log(ogData.smokes)

        // define y axis scaling
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(ogData, d => d.smokes) + 2]) //range of povery values
            .range([chartHeight, 0]); // chartHeight piels down the svg area to zero

        var leftAxis = d3.axisLeft(yLinearScale);

        //append axes to chart
        chartGroup
            .append("g")
            .call(leftAxis)
            .classed("axis", true) //for css styling

        //create a circle tag for each data object
        var scatterPoints = chartGroup.select(".scatterpoints").selectAll("circle")
        scatterPoints
            .data(ogData)
            .enter()
            .attr("cy", d => yLinearScale(d.smokes))
            .append("title")
            .text(d => d.state + "\nSmokes: " + d.smokes + "\nObesity: " + d.obesity)//hovertext

        //create text inside of each scatter point
        scatterPoints.selectAll("text")
            .data(ogData)
            .enter()
            .attr("y", d => yLinearScale(d.smokes))
            .append("title")
            .text(d => d.state + "\nSmokes: " + d.smokes + "\nObesity: " + d.obesity)//hovertext

    })
}
*/