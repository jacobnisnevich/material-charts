var MaterialCharts = {}

//// Chart initialization functions

// Bar Charts

MaterialCharts.bar = function( element, data ) {
	initializeChartArea( element, data.height, data.width, data.background, data.shadowDepth );
	insertTitle( element, data.title );
	insertAxes( element );
	insertData( element, parseInt(data.height), parseInt(data.width), data.datasets.values, Math.max.apply(null, data.datasets.values), data.datasets.labels, data.datasets.color );
	alignLabels( element );
}

// Pie Charts

MaterialCharts.pie = function( element, data ) {
	initializeChartArea( element, data.height, data.width, data.background, data.shadowDepth );
	insertTitle( element, data.title );
	$(element).append("<div style='position: absolute; margin: auto; top: 0; left: 0; right: 0; bottom: 0; height: 18px; width: 200px'><b>Pie Charts Not Available Yet</b></div>")
}

//// Helper functions

function initializeChartArea( element, height, width, background, shadowDepth ) {
	$(element).addClass("chart-area");
	$(element).css("height", height);
	$(element).css("width", width);
	$(element).css("background-color", background);
	$(element).addClass("shadow-" + shadowDepth);
}

function insertTitle( element, title ) {
	$(element).append("<div class='chart-title'>" + title + "</div>");
}

// Bar Charts

function insertAxes( element ) {
	$(element).append("<div class='box-chart-x-axis'></div>");
	$(element).append("<div class='box-chart-y-axis'></div>");
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
	$(element).append("<div class='box-chart-vertical-tick' style='bottom: " + heightPos + "px;'></div>");
	$(element).append("<div class='box-chart-vertical-tick-label' style='bottom: " + (heightPos - 4) + "px;'>" + label + "</div>");
}

function insertHorizontalLabel( element, horizontalPos, label ) {
	$(element).append("<div class='box-chart-horizontal-label' style='left: " + horizontalPos + "px;'>" + label + "</div>");
}

function insertVerticalBar( element, horizontalPos, horizontalSpread, height, value, color ) {
	$("<div class='box-chart-vertical-bar " + color + "' style='left: " + 
		(horizontalPos - horizontalSpread / 4) + "px; width: " + (horizontalSpread / 2) + 
		"px; height: " + height + "px'></div>").appendTo($(element)).hide().slideDown();
}

function alignLabels( element ) {
	var width, oldPosition, newPosition;

	$(element + " .box-chart-horizontal-label").each(function() {
		width = $(this).width();
		oldPosition = parseInt($(this).css("left"));
		newPosition = oldPosition - width / 2;
		$(this).css("left", newPosition + "px");
	})
}

// Pie Charts