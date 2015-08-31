"use strict";

var MaterialCharts = {};

//// Chart initialization functions

// Bar Charts

MaterialCharts.bar = function( element, data ) {
	MaterialCharts.helpers.initializeChartArea( element, data.height, data.width, data.background, data.shadowDepth, "bar" );
	var hovered = false;
	
	var validateResult = MaterialCharts.validators.validateBarChartData( data );

	if (validateResult.valid) {	
		MaterialCharts.helpers.insertTitle( element, data.title );
		MaterialCharts.helpers.bar.insertAxes( element );
		MaterialCharts.helpers.bar.insertData( element, parseInt(data.height), parseInt(data.width), data.datasets.values, Math.max.apply(null, data.datasets.values), data.datasets.labels, data.datasets.color );
		MaterialCharts.helpers.bar.alignLabels( element );
	} else {
		MaterialCharts.helpers.insertErrorMessage( element, validateResult.message );
	}

	window.setInterval(function () {
		if (hovered) {
			$(document).on("mousemove", function(event){
				$(element + " .material-charts-hover").css({top: event.clientY - 40, left: event.clientX + 15});
			});
		}
	}, 250);

	$(".material-charts-bar .material-charts-box-chart-vertical-bar").hover(function() {
		$(element + " .material-charts-hover-text").text($(this).data("hover"));
		$(element + " .material-charts-hover").css({top: event.clientY - 40, left: event.clientX + 15}).show();
		hovered = true;
	}, function() {
		$(element + " .material-charts-hover").hide();
		hovered = false;
	});
};

// Pie Charts

MaterialCharts.pie = function( element, data ) {
	MaterialCharts.helpers.initializeChartArea( element, data.height, data.width, data.background, data.shadowDepth, "pie" );
	var hovered = false;
	
	MaterialCharts.helpers.insertTitle( element, data.title );
	var pieChartPercentages = MaterialCharts.helpers.pie.computePercentages( data.dataset );
	var pieChartAngles = MaterialCharts.helpers.pie.computeAngles( pieChartPercentages );
	MaterialCharts.helpers.pie.drawPieSections( element, data.dataset.labels, pieChartPercentages, pieChartAngles );

	window.setInterval(function () {
		if (hovered) {
			$(document).on("mousemove", function(event){
				$(element + " .material-charts-hover").css({top: event.clientY - 40, left: event.clientX + 15});
			});
		}
	}, 250);

	$(".material-charts-pie .material-charts-pie-sector").hover(function() {
		$(element + " .material-charts-hover-text").text($(this).data("hover"));
		$(element + " .material-charts-hover").css({top: event.clientY - 40, left: event.clientX + 15}).show();
		hovered = true;
	}, function() {
		$(element + " .material-charts-hover").hide();
		hovered = false;
	});
};

//// Helper functions

MaterialCharts.helpers = {
	initializeChartArea: function( element, height, width, background, shadowDepth, type ) {
		$(element).addClass("material-charts-chart-area");
		$(element).addClass("material-charts-" + type);

		if (type == "pie") {
			$("<div class='material-charts-pie-chart material-charts-shadow-2'></div>").appendTo(element).css({
				height: 0.7 * Math.min(parseInt(height), parseInt(width)),
				width: 0.7 * Math.min(parseInt(height), parseInt(width))
			});
		}

		$(element).append("<div class='material-charts-hover'><div class='material-charts-hover-text'></div></div>");

		$(element).css("height", height);
		$(element).css("width", width);

		if (background) {
			$(element).css("background-color", background);
		} else {
			$(element).css("background-color", "transparent");
		}

		if (shadowDepth) {
			$(element).addClass("material-charts-shadow-" + shadowDepth);
		}
	},
	insertTitle: function( element, title ) {
		$(element).append("<div class='material-charts-chart-title'>" + title + "</div>");
	},
	insertErrorMessage: function( element, message ) {
		$(element).append("<div class='material-charts-error-message'><b>" + message + "</b></div>");
	}
};

MaterialCharts.helpers.bar = {
	insertAxes: function( element ) {
		$(element).append("<div class='material-charts-box-chart-x-axis'></div>");
		$(element).append("<div class='material-charts-box-chart-y-axis'></div>");
	},
	insertData: function( element, height, width, dataElements, dataMax, dataLabels, color ) {
		var tickMax = dataMax;

		while (tickMax % 5 !== 0) {
			tickMax++;
		}

		var absoluteHeightMultipler = ((height - 60) / tickMax);
		var verticalSpread = (tickMax / 5) * absoluteHeightMultipler;
		var startTickPosition = 25;
		var endTickPosition = (25 + tickMax) * absoluteHeightMultipler - (25)  * absoluteHeightMultipler;

		for (var i = startTickPosition + verticalSpread; i <= endTickPosition; i += verticalSpread) {
			this.insertVerticalTick( element, i, (i - 25) / absoluteHeightMultipler);
		}

		var horizontalSpread = (width - 50) / (dataLabels.length + 1);

		var j, barCount;
		for (j = startTickPosition + horizontalSpread, barCount = 0; barCount < dataLabels.length; j += horizontalSpread, barCount++ ) {
			this.insertHorizontalLabel( element, j, dataLabels[barCount]);
			this.insertVerticalBar( element, j, horizontalSpread, dataElements[barCount] * absoluteHeightMultipler, dataElements[barCount], color);
		}
	},
	insertVerticalTick: function( element, heightPos, label ) {
		$(element).append("<div class='material-charts-box-chart-vertical-tick' style='bottom: " + heightPos + "px;'></div>");
		$(element).append("<div class='material-charts-box-chart-vertical-tick-label' style='bottom: " + (heightPos - 4) + "px;'>" + label + "</div>");
	},
	insertHorizontalLabel: function( element, horizontalPos, label ) {
		$(element).append("<div class='material-charts-box-chart-horizontal-label' style='left: " + horizontalPos + "px;'>" + label + "</div>");
	},
	insertVerticalBar: function( element, horizontalPos, horizontalSpread, height, value, color ) {
		$("<div data-hover='" + value + "' class='material-charts-box-chart-vertical-bar material-charts-" + color + "' style='left: " + 
			(horizontalPos - horizontalSpread / 4) + "px; width: " + (horizontalSpread / 2) + 
			"px; height: " + height + "px'></div>").appendTo($(element)).hide().slideDown();
	},
	alignLabels: function( element ) {
		var width, oldPosition, newPosition;

		$(element + " .material-charts-box-chart-horizontal-label").each(function() {
			width = $(this).width();
			oldPosition = parseInt($(this).css("left"));
			newPosition = oldPosition - width / 2;
			$(this).css("left", newPosition + "px");
		});
	}
};

MaterialCharts.helpers.pie = {
	computePercentages: function( dataset ) {
		var sum = 0;
		var percentages = [];

		dataset.values.forEach(function(value) {
			sum += value;
		});

		dataset.values.forEach(function(value) {
			percentages.push(value / sum);
		});

		return percentages;
	},
	computeAngles: function( percentages ) {
		var angles = [];

		percentages.forEach(function(percentage) {
			angles.push(percentage * 360);
		});

		return angles;
	},
	drawPieSections: function( element, labels, percentages, angles ) {
		var index;
		var containerIndex = 0;
		var anglesTotal = 0;
		var secondOffset = -90;

		var colors = [
			"#1976d2",
			"#d32f2f",
			"#388e3c",
			"#ffeb3b",
			"#80cbc4"
		];

		for (index = 0; index < labels.length - 1; index++) {
			if (anglesTotal < 180 && (anglesTotal + angles[index] > 180)) {
				var firstAngle = 180 - anglesTotal;
				var secondAngle = angles[index] - firstAngle;
				this.drawPieSection( element, labels[index], percentages[index], firstAngle, secondOffset, colors[(index - 1 % 4)], containerIndex, "middle" );
				containerIndex++;
				this.drawPieSection( element, labels[index], percentages[index], secondAngle, secondOffset + firstAngle, colors[(index % 4)], containerIndex, "right" );
			} else {
				if (anglesTotal < 180) {
					this.drawPieSection( element, labels[index], percentages[index], angles[index], secondOffset, colors[(index % 4)], containerIndex, "left" );
				} else {
					this.drawPieSection( element, labels[index], percentages[index], angles[index], secondOffset, colors[(index % 4)], containerIndex, "right" );
				}
			}
			anglesTotal += angles[index];
			secondOffset += angles[index];
			containerIndex++;
		}
	},
	drawPieSection: function( element, label, percentage, angle, secondOffset, color, index, side ) {
		var backgroundString = "";

		if (side == "left") {
			$("<div class='material-charts-pie-sector-container-left material-charts-pie-sector-container-" + index + "'></div>").appendTo($(element + " .material-charts-pie-chart"));
		} else if (side == "right") {
			$("<div class='material-charts-pie-sector-container-right material-charts-pie-sector-container-" + index + "'></div>").appendTo($(element + " .material-charts-pie-chart"));
		} else {
			$("<div class='material-charts-pie-sector-container-middle material-charts-pie-sector-container-" + index + "'></div>").appendTo($(element + " .material-charts-pie-chart"));
		}

		if ((angle + secondOffset + 90) > 180) {
			backgroundString = "linear-gradient(90deg, transparent 50%, " + color + " 50%), linear-gradient(" + (angle + secondOffset) + "deg, " + color + " 50%, transparent 50%)";
		} else {
			backgroundString = "linear-gradient(270deg, transparent 50%, " + color + " 50%), linear-gradient(" + (angle + secondOffset) + "deg, " + color + " 50%, transparent 50%)";
		}

		$("<div class='material-charts-pie-sector'></div>")
			.appendTo($(element + " .material-charts-pie-sector-container-" + index))
			.css({
				"background-image": backgroundString,
				"z-index": index
			}).attr("data-hover", label + ", " + (percentage * 100) + "%")
	}
};


//// Validation functions

MaterialCharts.validators = {
	validateBarChartData: function( data ) {
		var validateResult = {
			"valid": true,
			"message": ""
		};

		if (data.datasets.values.length === 0) {
			validateResult.valid = false;
			validateResult.message = "Material Charts Error: Dataset values cannot be empty.";
			return validateResult;
		}

		if (data.datasets.labels.length === 0) {
			validateResult.valid = false;
			validateResult.message = "Material Charts Error: Dataset labels cannot be empty.";
			return validateResult;
		}

		if (data.datasets.labels.length != data.datasets.values.length) {
			validateResult.valid = false;
			validateResult.message = "Material Charts Error: Dataset labels and values must be the same length.";
			return validateResult;
		}

		if (data.datasets.color === null) {
			validateResult.valid = false;
			validateResult.message = "Material Charts Error: Dataset color must be specified.";
			return validateResult;
		}

		if (data.title === null) {
			validateResult.valid = false;
			validateResult.message = "Material Charts Error: Chart data must have a title.";
			return validateResult;
		}

		if (data.height === null || data.width === null) {
			validateResult.valid = false;
			validateResult.message = "Material Charts Error: Chart data must have a height and width.";
			return validateResult;
		}

		return validateResult;
	}
};
