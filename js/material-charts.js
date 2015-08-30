var MaterialCharts = {}

//// Chart initialization functions

// Bar Charts

MaterialCharts.bar = function( element, data ) {
	initializeChartArea( element, data.height, data.width, data.background, data.shadowDepth );
	var validateResult = validateBarChartData( data );
	if (validateResult.valid) {	
		insertTitle( element, data.title );
		insertAxes( element );
		insertData( element, parseInt(data.height), parseInt(data.width), data.datasets.values, Math.max.apply(null, data.datasets.values), data.datasets.labels, data.datasets.color );
		alignLabels( element );
	} else {
		insertErrorMessage( element, validateResult.message );
	}
}

// Pie Charts

MaterialCharts.pie = function( element, data ) {
	initializeChartArea( element, data.height, data.width, data.background, data.shadowDepth );
	insertTitle( element, data.title );
	insertErrorMessage( element, "Pie Charts Not Available Yet" );
}

//// Helper functions

function initializeChartArea( element, height, width, background, shadowDepth ) {
	$(element).addClass("material-charts-chart-area");
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
}

function insertTitle( element, title ) {
	$(element).append("<div class='material-charts-chart-title'>" + title + "</div>");
}

function insertErrorMessage( element, message ) {
	$(element).append("<div class='material-charts-error-message'><b>" + message + "</b></div>");
}

// Bar Charts

function insertAxes( element ) {
	$(element).append("<div class='material-charts-box-chart-x-axis'></div>");
	$(element).append("<div class='material-charts-box-chart-y-axis'></div>");
}

function insertData( element, height, width, dataElements, dataMax, dataLabels, color ) {
	var tickMax = dataMax;

	while (tickMax % 5 != 0) {
		tickMax++;
	}

	var absoluteHeightMultipler = ((height - 60) / tickMax);
	var verticalSpread = (tickMax / 5) * absoluteHeightMultipler;
	var startTickPosition = 25;
	var endTickPosition = (25 + tickMax) * absoluteHeightMultipler - (25)  * absoluteHeightMultipler;

	for (var i = startTickPosition + verticalSpread; i <= endTickPosition; i += verticalSpread) {
		insertVerticalTick( element, i, (i - 25) / absoluteHeightMultipler);
	}

	var horizontalSpread = (width - 50) / (dataLabels.length + 1);

	var i, barCount;
	for (i = startTickPosition + horizontalSpread, barCount = 0; barCount < dataLabels.length; i += horizontalSpread, barCount++ ) {
		insertHorizontalLabel( element, i, dataLabels[barCount]);
		insertVerticalBar( element, i, horizontalSpread, dataElements[barCount] * absoluteHeightMultipler, dataElements[barCount], color);
	}
}

function insertVerticalTick( element, heightPos, label ) {
	$(element).append("<div class='material-charts-box-chart-vertical-tick' style='bottom: " + heightPos + "px;'></div>");
	$(element).append("<div class='material-charts-box-chart-vertical-tick-label' style='bottom: " + (heightPos - 4) + "px;'>" + label + "</div>");
}

function insertHorizontalLabel( element, horizontalPos, label ) {
	$(element).append("<div class='material-charts-box-chart-horizontal-label' style='left: " + horizontalPos + "px;'>" + label + "</div>");
}

function insertVerticalBar( element, horizontalPos, horizontalSpread, height, value, color ) {
	$("<div class='material-charts-box-chart-vertical-bar material-charts-" + color + "' style='left: " + 
		(horizontalPos - horizontalSpread / 4) + "px; width: " + (horizontalSpread / 2) + 
		"px; height: " + height + "px'></div>").appendTo($(element)).hide().slideDown();
}

function alignLabels( element ) {
	var width, oldPosition, newPosition;

	$(element + " .material-charts-box-chart-horizontal-label").each(function() {
		width = $(this).width();
		oldPosition = parseInt($(this).css("left"));
		newPosition = oldPosition - width / 2;
		$(this).css("left", newPosition + "px");
	})
}

// Pie Charts

//// Validation functions

// Bar Charts

function validateBarChartData( data ) {
	var validateResult = {
		"valid": true,
		"message": ""
	}

	if (data.datasets.values.length == 0) {
		validateResult.valid = false;
		validateResult.message = "Material Charts Error: Dataset values cannot be empty.";
		return validateResult;
	}

	if (data.datasets.labels.length == 0) {
		validateResult.valid = false;
		validateResult.message = "Material Charts Error: Dataset labels cannot be empty.";
		return validateResult;
	}

	if (data.datasets.labels.length != data.datasets.values.length) {
		validateResult.valid = false;
		validateResult.message = "Material Charts Error: Dataset labels and values must be the same length.";
		return validateResult;
	}

	if (data.datasets.color == null) {
		validateResult.valid = false;
		validateResult.message = "Material Charts Error: Dataset color must be specified.";
		return validateResult;
	}

	if (data.title == null) {
		validateResult.valid = false;
		validateResult.message = "Material Charts Error: Chart data must have a title.";
		return validateResult;
	}

	if (data.height == null || data.width == null) {
		validateResult.valid = false;
		validateResult.message = "Material Charts Error: Chart data must have a height and width.";
		return validateResult;
	}

	return validateResult;
}
