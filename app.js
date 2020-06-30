// 1. Use the D3 library to read in `samples.json`.

function buildMetadata(a){
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == a);
        var result = resultArray[0];
        var sampleData = d3.select("#sample-metadata");
        sampleData.html("");
    
        Object.entries(result).forEach(function([key,value]){
            sampleData.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
};
//Display the sample metadata, i.e., an individual's demographic information.
function populateDropdown() {
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        data.names.forEach((name) => {
            selector
            .append("option")
            .text(name)
            .property("value",name);
        });

    })

};

populateDropdown();

function optionChanged(newEntry) {
    console.log(newEntry);
    buildMetadata(newEntry);
    buildBubbleChart(newEntry);
    buildBarChart(newEntry);

};

// * Use `sample_values` as the values for the bar chart.
// * Use `otu_ids` as the labels for the bar chart.
// * Use `otu_labels` as the hovertext for the chart.
function buildBarChart(inputID) {
    d3.json('samples.json').then(function(data) {
        var samplesData = data.samples;
        var resultArray = samplesData.filter(obj => obj.id == inputID);
        var result = resultArray[0];

        var x_axis = result.sample_values.slice(0,10).reverse();
        var y_axis = result.otu_ids.map(d => 'OTU' +d);
        var text_values = data.out_labels;

        var trace1 = {
            x: x_axis,
            y: y_axis,
            text: text_values,
            type: 'bar',
            orientation: 'h'
        };

        var data = [trace1];

        var layout = {
            title: 'OTU ID',
            showlegend: true,
            height: 600,
            width: 300
        };

        Plotly.newPlot('bar', data, layout);

    });
};

// 3. Create a bubble chart that displays each sample.
// * Use `otu_ids` for the x values.
// * Use `sample_values` for the y values.
// * Use `sample_values` for the marker size.
// * Use `otu_ids` for the marker colors.
// * Use `otu_labels` for the text values.
function buildBubbleChart(inputID) {
    d3.json('samples.json').then(function(data) {
        var samplesData = data.samples;
        var resultArray = samplesData.filter(obj => obj.id == inputID);
        var result = resultArray[0];

        var x_axis = result.otu_ids;
        var y_axis = result.sample_values;
        var marker_size = result.sample_values;
        var marker_color = result.otu_ids;
        var text_values = result.otu_labels;

        var trace1 = {
            x: x_axis,
            y: y_axis,
            mode: 'markers',
            marker: {
                size: marker_size,
                color: marker_color,
            },
            text: text_values
        };

        var data = [trace1];

        var layout = {
            title: 'OTU ID',
            showlegend: true,
            height: 600,
            width: 1000
        };

        Plotly.newPlot('bubble', data, layout);
    });
};
