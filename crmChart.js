var ctxCRM = document.getElementById("crmPlot").getContext("2d");

var crmTargetAreaDataset = {
	label: 'Recommended Range of Class A Color',
	fill: false,
	lineTension: 0.1,
	backgroundColor: "rgba(192,0,0,1)",
	borderColor: "rgba(192,0,0,1)",
	pointBorderColor: "rgba(182,0,0,1)",
	pointRadius: 0,
	showLine: true,
	data: [{
		x: 80,
		y: 100,
	},{
		x: 100,
		y: 100,
	},{
		x: 100,
		y: 80,
	},{
		x: 80,
		y: 80,
	},{
		x: 80,
		y: 100,
	}],
};

var combinedSourceCRMDataset = {
	label: 'Combined Source',
	fill: false,
	lineTension: 0.1,
	backgroundColor: "rgba(75,192,192,1)",
	borderColor: "rgba(75,192,192,1)",
	pointBorderColor: "rgba(75,192,192,1)",
	pointRadius: 5,
	pointHoverRadius: 10,
	showLine: false,
	data: [{
		x: NaN,
		y: NaN,
	}]
};

var configCRM = {
	type: 'scatter',
	data: {
		//labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100],
		datasets: [
			combinedSourceCRMDataset,
			crmTargetAreaDataset,
		]
	},
	options: {
		responsive: true,
		spanGaps: true,
		legend: {
			display: false,
		},
		tooltips: {
            callbacks: {
				title: function(tooltipItems, data) {
					var label = data.datasets[tooltipItems[0].datasetIndex].label;
					return label;
				},
                label: function(tooltipItem, data) {
					var wavelengthStr = 'CRI: ' + tooltipItem.xLabel.toFixed(2);
					var valueStr = 'GAI: ' + tooltipItem.yLabel.toFixed(2);
					return [wavelengthStr, valueStr];
				}
            }
        },
		scales: {
			yAxes: [{
				position: 'left',
				ticks: {
					min: 0,
					max: 140,
					stepSize: 20, 
				},
				scaleLabel: {
					display: true,
					labelString: 'Gamut Area Index (GAI)',
				}
			}],
			xAxes: [{
				position: 'bottom',
				ticks: {
					autoSkip: true,
					min: 20,
					max: 100,
					stepSize: 20,
				},
				scaleLabel: {
					display: true,
					labelString: 'Color Rendering Index (CRI)',
				},
			}]
		},
		elements: {
			point: {
			}
		},
	}
};
var crmChart = new Chart(ctxCRM,configCRM);
document.getElementById('crmLegend').innerHTML = crmChart.generateLegend();