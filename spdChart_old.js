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
	data: arrayScalar(setwavelength,NaN),
	yAxisID: 'y-axis-1',
};

var spectralEfficiencyFunctionDataset = {
	label: 'Spectral Efficiency Response',
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
	data: arrayScalar(setwavelength,NaN),
	yAxisID: 'y-axis-2',
};


var configSPD = {
	type: 'line',
	data: {
		labels: setwavelength,
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
					labelString: 'Power (%)',
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
					labelString: 'Weight',
				}
			}],
			xAxes: [{
				ticks: {
					autoSkip: true,
					//maxTicksLimit: 36
					//maxTicksLimit: 26
					//maxTicksLimit: 11,
					min: 350,
					max: 750,
					stepSize: 50,
				},
				scaleLabel: {
					display: true,
					labelString: 'Wavelength (nm)',
				}
			}]
		},
		elements: {
			point: {
				radius: 0
			},
		},
		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {
					var datasetLabel = data.datasets[tooltipItem.datasetIndex].label;
					return datasetLabel;
				},
			},
		},
	}
};
var spdChart = new Chart(ctxSPD,configSPD);
document.getElementById('spdLegend').innerHTML = spdChart.generateLegend();
