
// python -m http.server --cgi 8000
// console.log("/static/js/data/samples.json")
var data;
async function init() {
    data = await d3.json("static/data/samples.json");
    let selectValues = data.names;
    let selectOpt = d3.select("#selDataset");
    selectValues.forEach(value => {
        selectOpt
        .append("option")
        .text(value)
        .attr("value", function() {
            return value;
        });
    });
    filterData("940"); // Default to 940 first record
};


var plotFunctions = function () {
  let valueSelect = d3.select("#selDataset").node().value;
  filterData(valueSelect);
};

function filterData(valueSelect){
  let metafilterdata = data.metadata.filter(value => value.id == valueSelect);
  let samplefilterdata = data.samples.filter(value => value.id == valueSelect);
  plotData(metafilterdata,samplefilterdata);
}

function  plotData(metafilterdata,samplefilterdata){
    panelData(metafilterdata);
    barPlotChart(samplefilterdata);
    gaugeChart(metafilterdata);
    bubbleChart(samplefilterdata);
}

function panelData(metafilterdata){
  let divValue = d3.select(".panel-body");
  divValue.html("");
  divValue.append("p").text(`id: ${metafilterdata[0].id}`);
  divValue.append("p").text(`ethnicity: ${metafilterdata[0].ethnicity}`);
  divValue.append("p").text(`gender: ${metafilterdata[0].gender}`);
  divValue.append("p").text(`age: ${metafilterdata[0].age}`);
  divValue.append("p").text(`location: ${metafilterdata[0].location}`);
  divValue.append("p").text(`bbtype: ${metafilterdata[0].bbtype}`);
  divValue.append("p").text(`wfreq: ${metafilterdata[0].wfreq}`);
}


function barPlotChart(samplefilterdata){
    let otuid = samplefilterdata.map(v => v.otu_ids)[0].slice(0, 10).map(i => 'OTU ' + i);;
    let sample_value = samplefilterdata.map(v => v.sample_values)[0].slice(0, 10)
    let otu_label = samplefilterdata.map(v => v.otu_labels)[0].slice(0, 10)
    let trace = {
      x: sample_value,
      y: otuid,
      text: otu_label,
      type: "bar",
      orientation: "h"
    };
    let layout = {
      yaxis: {
        autorange: "reversed"
      }
    };
    let bardata = [trace];
    Plotly.newPlot("bar", bardata, layout);
  }  

// Bonus
function gaugeChart(metafilterdata) {
  let weeklyFreq = metafilterdata[0].wfreq;
  let trace = {
    domain: { x: [0, 1], y: [0, 1] },
    title: {
      text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"
    },
    type: "indicator",
    mode: "gauge",
    gauge: {
      axis: {
        range: [0, 9],
        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        ticktext :["0","0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9" ]  ,
        ticks: "outside"
      },
      steps: [
        { range: [0, 1], color: "EEDFE7" },
        { range: [1, 2], color: "#E2CBD2" },
        { range: [2, 3], color: "#D5B6BA" },
        { range: [3, 4], color: "#C9A4A2" },
        { range: [4, 5], color: "#BC998E" },
        { range: [5, 6], color: "#AF917A" },
        { range: [6, 7], color: "#A28B67" },
        { range: [7, 8], color: "#797B4C" },
        { range: [8, 9], color: "#5D673E" }
      ],
      threshold: {
        line: {color:"red", width: 4 },
        thickness: 1,
        value: weeklyFreq
      }
    }
  }
  let data=[trace];
  let layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot("gauge", data, layout);
}

function bubbleChart(samplefilterdata) {
  let otuid = samplefilterdata.map(v => v.otu_ids)[0];
  let sample_value = samplefilterdata.map(v => v.sample_values)[0];
  let otu_label = samplefilterdata.map(v => v.otu_labels)[0]
    
  let trace = {
    x: otuid,
    y: sample_value,
    mode: "markers",
    marker: {
      color: otuid,
      size: sample_value
    },
    text: otu_label
  };
  let data = [trace];

  let layout = {
    showlegend: false,
    xaxis: { title: "OTU ID" }
  };

  Plotly.newPlot("bubble", data, layout);
}

d3.selectAll("#selDataset").on("change", plotFunctions);
init(); // load the data and display default record
