// Define SVG area dimensions
var svgWidth = 800;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
top: 30,
right: 30,
bottom: 30,
left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
.select("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

//create g tag container for chart area
var chartGroup = svg.append("g")
.attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

//read in file and fulfill promise
d3.csv("assets/data/data.csv").then(function (ogData) {
console.log(ogData)
//transform data types
ogData.forEach(function (d) {
    //convert to nummeric
    d.poverty = +d.poverty
    d.povertyMoe = +d.povertyMoe
    d.age = +d.age
    d.ageMoe = +d.ageMoe
    d.income = +d.income
    d.incomeMoe = +d.incomeMoe
    d.healthcare = +d.healthcare
    d.healthcareLow = +d.healthcareLow
    d.healthcareHigh = +d.healthcareHigh
    d.obesity = +d.obesity
    d.obesityLow = +d.obesityLow
    d.obesityHigh = +d.obesityHigh
    d.smokes = +d.smokes
    d.smokesLow = +d.smokesLow
    d.smokesHigh = +d.smokesHigh
});
console.log(ogData)

//define x axis scaling
var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(ogData, d => d.obesity)) //range of obesity values
    .range([0, chartWidth]); //from zero to end of chart

// define y axis scaling
var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(ogData, d => d.poverty)]) //range of povery values
    .range([chartHeight, 0]); // chartHeight piels down the svg area to zero

// create scaled axis variables
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

//append axes to chart
chartGroup.append("g")
.call(leftAxis)
.classed("axis", true) //for css styling
chartGroup.append("g")
.classed("axis", true) //for css styling
.attr("transform", `translate(0, ${chartHeight})`) //move from top to bottom of chart
.call(bottomAxis);

//create a circle tag for each data object
var scatterPoints = chartGroup.selectAll("circle")
scatterPoints.data(ogData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.obesity)) //set cx coord to scaled obesity data
.attr("cy", d => yLinearScale(d.poverty)) //set cy coord to scaled poverty data
.attr("r", 8) //size of points
.attr()

/* ====AXIS LABELS =====

chartGroup.append("text")
// Position the text
// Center the text:
// (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor)
.attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 20})`)
.attr("text-anchor", "middle")
.attr("font-size", "16px")
.attr("fill", "black")
.text("Poverty");

chartGroup.append("text")
.attr("transform", `translate(${chartHeight / 2}, ${chartWidth + chartMargin.top + 37})`)
.attr("text-anchor", "middle")
.attr("font-size", "16px")
.attr("fill", "black")
.text("Obesity");


 ======= POINT LABELS =====
chartGroup.selectAll("text")
.data(ogData)
.enter()
.append("text")
// Add your code below this line

        .text((d) => (d[0] + "," + d[1]))
        .attr("x", (d) => (d[0] + 5))
        .attr("y", (d) => (h - d[1]));   
// Add your code above this line
*/
})





