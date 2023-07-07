


//function that populates the meta data
function demoInfo(sample)
{
    //console.log(sample);

    d3.json("samples.json").then((data) => {
        let metaData = data.metadata;
        //console.log(metaData);

         //filter based on the value of the sample
        let result = metaData.filter(sampleResult => sampleResult.id == sample);

        //console.log(result);

        //access index 0 from array
        let resultSample = result[0];
        console.log(resultSample);

        //clear the metadata out
        d3.select("#sample-metadata").html(""); //clears the HTML out

        //use object.entries to get value of key pairs
        Object.entries(resultSample).forEach(([key, value]) =>{
            //add to the sample data / demographics section
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
        
    });
}

//function that builds the graphs
function buildBarChart(sample)
{
    //console.log(sample);
    //let data = d3.json("samples.json");
    //console.log(data);

    d3.json("samples.json").then((data) => {
        //grab the samples
        let sampleData = data.samples;
        //console.log(sampleData);

        
         //filter based on the value of the sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        
        //access index 0 from array
        let resultSample = result[0];
        console.log(resultSample);

        //get the otu_ids
        let otu_ids = resultSample.otu_ids;
        let otu_labels = resultSample.otu_labels;
        let sample_values = resultSample.sample_values;
        //console.log(otu_ids);
        //console.log(otu_labels);
        //console.log(sample_values);

        //build the bar chart
        //get the y ticks
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0, 10);
        let txtLabels = otu_labels.slice(0, 10);
        //console.log(txtLabels);

        let barChart = {
            y : yticks.reverse(),
            x: xValues.reverse(), 
            text: txtLabels,
            type: "bar",
            orientation: "h"
        }
        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout);

    });
}

//function that builds the bubble chart
function buildBubbleChart(sample)
{
 
    d3.json("samples.json").then((data) => {
        //grab the samples
        let sampleData = data.samples;
        //console.log(sampleData);

        
         //filter based on the value of the sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        
        //access index 0 from array
        let resultSample = result[0];
        console.log(resultSample);

        //get the otu_ids
        let otu_ids = resultSample.otu_ids;
        let otu_labels = resultSample.otu_labels;
        let sample_values = resultSample.sample_values;
     
        let bubbleChart = {
            y : sample_values,
            x: otu_ids, 
            text: otu_labels,
            mode: "markers",
            marker:{
                size: sample_values,
                color: otu_ids,
                colorscale: "Picnic"
            }
        }
        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", [bubbleChart], layout);

    });

}

//initialize the dashboard
function initialize()
{

    //let data = d3.json("samples.json");
    //console.log(data);

    // access the dropdown selector from the indes.html
    var select = d3.select("#selDataset");

    //use d3.json in order to get data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names;
        //console.log(sampleNames);
   
    
// use a foreach in order to create option for ea samples in the selection
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });


    //pass in first sample to initialize
    let firstSample = sampleNames[0];

    //call function for metadata
    demoInfo(firstSample);

    //call the function to build the bar chart
    buildBarChart(firstSample);

    //call function to build bubble
    buildBubbleChart(firstSample);
        
});

}

//function that updates the dash
function  optionChanged(item)
{
    demoInfo(item);
    //call function to build the bar chart
    buildBarChart(item);
    //call function to build the bubble chart
    buildBubbleChart(item);
}

//call the function
initialize();