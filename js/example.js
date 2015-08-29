$(document).ready(function() {
	var exampleBarChartData = {
		"datasets": {
			"values": [5, 10, 30, 50, 20],
			"labels": [
				"Apples", 
				"Oranges", 
				"Berries", 
				"Peaches", 
				"Bananas"
			],
			"color": "blue"
		},
		"title": "Example Box Chart",
		"height": "300px",
		"width": "500px",
		"background": "#FFFFFF",
		"shadowDepth": "1"
	};

	MaterialCharts.bar("#box-chart-example", exampleBarChartData)

	var examplePieChartData = {
		"datasets": {
			"values": [5, 30, 5, 20, 40],
			"labels": [
				"Apples", 
				"Oranges", 
				"Berries", 
				"Peaches", 
				"Bananas"
			],
		},
		"title": "Example Pie Chart",
		"height": "300px",
		"width": "500px",
		"background": "#FFFFFF",
		"shadowDepth": "1"
	};

	MaterialCharts.pie("#pie-chart-example", examplePieChartData)
});