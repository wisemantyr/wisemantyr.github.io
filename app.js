function buildDropMenu() {
    d3.json("samples.json").then((data) => {
        //isolate test subject numbers for drop down options
        var testSubjects = data.names;
        //save dropdown menu 
        dropMenu = d3.select("#selDataset");
        //create dropdown option for every ID
        testSubjects.forEach(function (subject) {
            //append menu with a new option
            newOption = dropMenu.append("option");
            //add class to option equal to test subject ID
            newOption.attr("value", subject);
            //fill option text with test subject ID
            newOption.text(subject);
        });
        //check that options were added
        console.log("dropdown menu html: ", dropMenu.html());
    });
};

//create function for formatting otu_ids for plot ticks
var formattedLabels = [];

function formatLabels(array) {
    array.forEach(function (item) {
        formattedLabels.push("OTU " + item);
    });
};

function initBar() {
    d3.json("samples.json").then((data) => {
        //sort data by sample_values in ascending order
        var sortedSamples = data.samples.sort((a, b) => b.sample_values - a.sample_values);
        //choose random data for default (first drop down option)
        var defaultObject = sortedSamples[0];
        console.log("Default Bar Object: ", defaultObject)
        //get top ten otu_ids
        var defaultLabels = defaultObject.otu_ids.slice(0, 10);
        //format them for plot
        formatLabels(defaultLabels);
        //get top ten labels for hover text
        var defaultHoverText = defaultObject.otu_labels.slice(0, 10);
        //build plot
        var defaultTrace = {
            y: formattedLabels,
            x: defaultObject.sample_values.slice(0, 10),
            text: defaultHoverText,
            type: "bar",
            orientation: "h",
        };
        var defaultLayout = {
            title: "Most Prevelant Bacteria Samples",
            xaxis: {title: "Bacteria Sample Values"}
        }
        var defaultData = [defaultTrace];
        Plotly.newPlot("bar", defaultData, defaultLayout);
    });
};

function initDemographics() {
    d3.json("samples.json").then((data) => {
        //isolate metadata
        var meta = data.metadata;
        //initialize chart with first drop down option
        defaultObject = meta[0];
        //select content location
        infoArea = d3.select("#sample-metadata");
        //iterate through object k,v pairs
        Object.entries(defaultObject).forEach(([key, value]) => {
            //create a new paragraph tag for each entry
            newP = infoArea.append("p");
            //set value of text to k,v pair
            newP.text(`${key}: ${value}`);
        });
        //check info Area
        console.log("info Area: ", infoArea);
    });
};

function initBubble() {
    d3.json("samples.json").then((data) => {
        var sampleObjects = data.samples;
        defaultObject = sampleObjects[0]
        console.log("default bubble data: ", defaultObject)
        defaultTrace = {
            x: defaultObject.otu_ids,
            y: defaultObject.sample_values,
            text: defaultObject.otu_labels,
            mode: "markers",
            marker: {
                size: defaultObject.sample_values,
                color: defaultObject.otu_ids
            }
        };
        defaultLayout = {
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" },
            title: "All Bacteria Samples"
        };
        defaultData = [defaultTrace];
        Plotly.newPlot("bubble", defaultData, defaultLayout);

    });
};

//create event handler function from index file to update plots
function optionChanged(option) {
    d3.json("samples.json").then((data) => {

        ////UPDATE BAR////

        //sort data
        var sortedSamples = data.samples.sort((a, b) => b.sample_values - a.sample_values);
        //iterate through sorted data
        sortedSamples.forEach(function (sample) {
            //match slected option with id from sorted samples
            if (option === sample.id) {
                console.log("sample id match: ", sample.id);
                //change header
                var header = d3.select("#subject-no")
                //clear text
                header.text("")
                //repleace with correct id
                header.text(`Test Subject ID # ${sample.id}`)
                //get top ten otu_ids of matching data
                barLabels = sample.otu_ids.slice(0, 10);
                console.log("otu_ids ", barLabels);
                //format for plot lables
                formatLabels(barLabels);
                console.log("formatted labels: ", formattedLabels);
                //get top ten sample_values
                var barValues = sample.sample_values.slice(0, 10);
                console.log("bar chart values: ", barValues);
                //get top ten otu_labels
                var barHoverText = sample.otu_labels.slice(0, 10);
                console.log("bar chart hover text: ", barHoverText);
                //assign values for plot updating
                barX = barValues;
                barY = formattedLabels;
                barText = barHoverText;
            };
        });
        //update bar chart with chosen data
        Plotly.restyle("bar", "x", [barX]);
        Plotly.restyle("bar", "y", [barY]);
        Plotly.restyle("bar", "text", [barText]);

        ////UPDATE DEMOGRAPHICS////

        //isolate metadata objects
        var metaObjects = data.metadata;
        console.log("metadata: ", metaObjects)
        //select content location from index.html
        infoArea = d3.select("#sample-metadata")
        //iterate through metadata object
        metaObjects.forEach(function (object) {
            //match option string to integer object.id
            if (parseInt(option) === object.id) {
                console.log("demographics id match: ", object.id)
                //reset infoArea
                infoArea.html("");
                //iterate through matching object
                Object.entries(object).forEach(([key, value]) => {
                    //create new paragraph tag for each k,v pair
                    newP = infoArea.append("p");
                    //fill text with k,v pair
                    newP.text(`${key}: ${value}`);
                });
            };
        });

        ////UPDATE BUBBLE////

        var sampleObjects = data.samples;
        console.log("Bubble sample objects: ", sampleObjects)

        sampleObjects.forEach(function (object) {
            if (option === object.id) {
                console.log("bubble id match: ", object.id);

                bubbleX = object.otu_ids;
                bubbleY = object.sample_values;
                bubbleText = object.otu_labels;
                bubbleMarker = {
                    size: object.sample_values,
                    color: object.otu_ids
                };
            };
        });
        Plotly.restyle("bubble", "x", [bubbleX]);
        Plotly.restyle("bubble", "y", [bubbleY]);
        Plotly.restyle("bubble", "text", [bubbleText]);
        Plotly.restyle("bubble", "marker", [bubbleMarker]);
    });
};

buildDropMenu();
initBar();
initDemographics();
initBubble();