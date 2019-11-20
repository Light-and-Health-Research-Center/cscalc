var ctxSPD = document.getElementById("spdPlot").getContext("2d");

var chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

var dataTestNan = new Array();
for(var k = 0;k < setwavelength.length;k++){
	dataTestNan[k] = {
		x: setwavelength[k],
		y: NaN,
	};
}
var dataTestZero = new Array();
for(var k = 0;k < setwavelength.length;k++){
	dataTestZero[k] = {
		x: setwavelength[k],
		y: 0,
	};
}

var combinedSourceDataset = {
	label: 'Combined Source SPD',
	fill: false,
	lineTension: 0.1,
	backgroundColor: "rgba(75,192,192,1)",
	borderColor: "rgba(75,192,192,1)",
	borderCapStyle: 'butt',
	borderDash: [],
	borderDashOffset: 0.0,
	borderJoinStyle: 'miter',
	pointBorderColor: "rgba(75,192,192,1)",
	pointBackgroundColor: "#fff",
	pointBorderWidth: 1,
	radius: 0,
	data: dataTestNan,
	yAxisID: 'y-axis-1',
};

var spectralEfficiencyFunctionDataset = {
	label: 'Circadian Stimulus Spectral Efficiency Response',
	fill: false,
	lineTension: 0.1,
	backgroundColor: "rgba(75,192,192,1)",
	borderColor: "rgba(75,192,192,1)",
	borderCapStyle: 'butt',
	borderDash: [],
	borderDashOffset: 0.0,
	borderJoinStyle: 'miter',
	pointBorderColor: "rgba(75,192,192,1)",
	pointBackgroundColor: "#fff",
	pointBorderWidth: 1,
	radius: 0,
	data: dataTestNan,
	yAxisID: 'y-axis-2',
};


var configSPD = {
	type: 'scatter',
	data: {
		datasets: [
			//combinedSPD
		]
	},
	options: {
		responsive: true,
		spanGaps: true,
		legend: {
			display: false,
		},
		tooltips: {
			bodyFontStyle: 'bold',
            callbacks: {
			/*
				title: function(tooltipItems, data) {
					var label = data.datasets[tooltipItems[0].datasetIndex].label;
					return label;
				},
                label: function(tooltipItem, data) {
					var wavelengthStr = 'Wavelength: ' + tooltipItem.xLabel.toFixed() + ' nm';
					var valueStr = 'Value: ' + tooltipItem.yLabel.toFixed(2);
					return [wavelengthStr, valueStr];
				}
				*/
				label: function(tooltipItem, data) {
					var label = data.datasets[tooltipItem.datasetIndex].label;
					return label;
				}
            }
        },
		scales: {
			yAxes: [{
				id: 'y-axis-1',
				position: 'left',
				ticks: {
					min: -0.4,
					max: 1
				},
				scaleLabel: {
					display: true,
					labelString: 'Relative Spectral Power (%)',
					padding: 0,
				}
			},{
				id: 'y-axis-2',
				position: 'right',
				ticks: {
					min: -0.4,
					max: 1
				},
				scaleLabel: {
					display: true,
					labelString: 'Relative Spectral Contribution of Circadian Response*',
					padding: 0,
				}
			}],
			xAxes: [{
				ticks: {
					autoSkip: true,
					min: 350,
					max: 750,
					stepSize: 25,
				},
				scaleLabel: {
					display: true,
					labelString: 'Wavelength (nm)',
					padding: 0,
				}
			}]
		},
		elements: {
			point: {
				radius: 0,
				hitRadius: 5,
			}
		},
	}
};
var spdChart = new Chart(ctxSPD,configSPD);
document.getElementById('spdLegend').innerHTML = spdChart.generateLegend();
