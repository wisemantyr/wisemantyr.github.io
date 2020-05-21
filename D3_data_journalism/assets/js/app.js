// Define SVG area dimensions
var svgWidth = 800;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 100,
    left: 140
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
var chartGroup = svg.append("g")
.attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

//initial axes
var chosenX = "obesity";
var chosenY = "poverty";


function xScale(censusData, chosenX) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenX]) * .9, d3.max(censusData, d => d[chosenX]) * 1.1])
        .range([0, chartWidth]);
    return xLinearScale;
}

function yScale(censusData, chosenY) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenY]) * .9, d3.max(censusData, d => d[chosenY]) * 1.1])
        .range([chartHeight, 0]);
    return yLinearScale;
}

function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

function renderPointsX(scatterPoints, newXScale, chosenX) {

    scatterPoints.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenX]));
    return scatterPoints;
}

function renderPointsY(scatterPoints, newYScale, chosenY) {

    scatterPoints.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenY]));
    return scatterPoints;
}

function renderTextX (circleText, newXScale, chosenX) {
    circleText.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenX]));
    return circleText;
}
function renderTextY (circleText, newYScale, chosenY) {
    circleText.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenY]));
    return circleText;
}

function updateToolTip(chosenX, chosenY, scatterPoints) {
    var xLabel;
    var yLabel;

    if (chosenX === "obesity") { //value for event listener
        xLabel = "Obesity"
    }
    else if (chosenX === "healthcare") {
        xLabel = "Have Healthcare"
    }
    else {
        xLabel = "Smokes"
    }

    if (chosenY === "poverty") { //value for event listener
        yLabel = "Poverty (%)"
    }
    else if (chosenY === "income") {
        yLabel = "Income"
    }
    else {
        yLabel = "Age"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([75, 45])
        .html(function (d) {
            return (`${d.state} <br> ${xLabel}: ${d[chosenX]}% <br> ${yLabel}: ${d[chosenY]}`)
        });

    scatterPoints.call(toolTip)

    scatterPoints
        .on("mouseover", function (d) {
            toolTip.show(d);
        })
        .on("mouseout", function (d) {
            toolTip.hide(d);
        });

    return scatterPoints;
}

d3.csv("assets/data/data.csv").then(function (censusData) {
    console.log(censusData)
    //transform data types
    censusData.forEach(function (d) {
        d.poverty = +d.poverty
        d.obesity = +d.obesity
        d.age = +d.age
        d.smokes = +d.smokes
        d.income = +d.income
        d.healthcare = +d.healthcare
    });
    console.log(censusData)

    var xLinearScale = xScale(censusData, chosenX);
    var yLinearScale = yScale(censusData, chosenY);
    console.log(xLinearScale)
    console.log(yLinearScale)

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    console.log(bottomAxis)
    console.log(leftAxis)

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    console.log(xAxis)
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
    console.log(yAxis)

    var scatterPoints = chartGroup.append("g").selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenX]))
        .attr("cy", d => yLinearScale(d[chosenY]))
        .attr("r", 12) //size of points
        .attr("fill", "#b3e6b3") //color of points
        .attr("opacity", ".75");

    var circleText = chartGroup.append("g").selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenX]))
        .attr("y", d => yLinearScale(d[chosenY]))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("stroke", "black")
        .attr("stroke-width", .5)
        .text(d => d.abbr)
        .classed("scatterpoint-text", true)

    var labelsGroupX = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    var obesityLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "obesity") //for event listener
        .classed("active-axis", true)
        .text("Obesity Rate (%)");

    var smokesLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 45)
        .attr("value", "smokes") //for event listener
        .classed("inactive-axis", true)
        .text("Smoking Rate (%)");

    var healthcareLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 70)
        .attr("value", "healthcare")
        .classed("inactive-axis", true)
        .text("Have Healthcare (%)")

    var labelsGroupY = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var povertyLabel = labelsGroupY.append("text")
        .attr("x", -(chartHeight / 2))
        .attr("y", -(chartMargin.left/2) + 20)
        .attr("value", "poverty") //for event listener
        .classed("active-axis", true)
        .text("Poverty Rate (%)");

    var ageLabel = labelsGroupY.append("text")
        .attr("x", -(chartHeight / 2))
        .attr("y", -(chartMargin.left / 2 + 5))
        .attr("value", "age") //for event listener
        .classed("inactive-axis", true)
        .text("Age");

    var incomeLabel = labelsGroupY.append("text")
        .attr("x", -(chartHeight/2))
        .attr("y", -(chartMargin.left/2 + 30))
        .attr("value", "income")
        .classed("inactive-axis", true)
        .text("Income")

    var scatterPoints = updateToolTip(chosenX, chosenY, scatterPoints);

    labelsGroupX.selectAll("text")
        .on("click", function () {
            var value = d3.select(this).attr("value");
            if (value !== chosenX) {

                chosenX = value;
                console.log(chosenX);

                xLinearScale = xScale(censusData, chosenX);
                xAxis = renderXAxis(xLinearScale, xAxis);

                scatterPoints = renderPointsX(scatterPoints, xLinearScale, chosenX);
                scatterPoints = updateToolTip(chosenX, chosenY, scatterPoints);

                circleText = renderTextX(circleText, xLinearScale, chosenX);

                if (chosenX === "smokes") {
                    smokesLabel
                        .classed("active-axis", true)
                        .classed("inactive-axis", false);
                    obesityLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false)
                    healthcareLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false)
                }
                else if (chosenX === "healthcare") {
                    smokesLabel
                        .classed("active-axis", false)
                        .classed("inactive-axis", true);
                    obesityLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false)
                    healthcareLabel
                        .classed("inactive-axis", false)
                        .classed("active-axis", true)
                }
                else {
                    smokesLabel
                        .classed("active-axis", false)
                        .classed("inactive-axis", true);
                    obesityLabel
                        .classed("inactive-axis", false)
                        .classed("active-axis", true);
                    healthcareLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false)
                    }
            }
        });

    labelsGroupY.selectAll("text")
        .on("click", function () {
            var value = d3.select(this).attr("value");
            if (value !== chosenY) {

                chosenY = value;
                console.log(chosenY);

                yLinearScale = yScale(censusData, chosenY);
                yAxis = renderYAxis(yLinearScale, yAxis);

                scatterPoints = renderPointsY(scatterPoints, yLinearScale, chosenY);
                scatterPoints = updateToolTip(chosenX, chosenY, scatterPoints);

                circleText = renderTextY(circleText, yLinearScale, chosenY)

                if (chosenY === "age") {
                    ageLabel
                        .classed("active-axis", true)
                        .classed("inactive-axis", false);
                    povertyLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false);
                    incomeLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false);
                }
                else if (chosenY === "income") {
                    ageLabel
                        .classed("active-axis", false)
                        .classed("inactive-axis", true);
                    povertyLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false);
                    incomeLabel
                        .classed("inactive-axis", false)
                        .classed("active-axis", true);
                }
                else {
                    ageLabel
                        .classed("active-axis", false)
                        .classed("inactive-axis", true);
                    povertyLabel
                        .classed("inactive-axis", false)
                        .classed("active-axis", true);
                    incomeLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false);

                }
            }
        });
});