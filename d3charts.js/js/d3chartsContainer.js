/**
 * D3 Chart - Chart Container
 * Copyright (c) 2015 Aravind Arivarasan, https://github.com/aaravind/d3charts
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
var d3charts = function (chartType, chartId, chartdata, chartwidth, chartheight) {
   
    if (chartType == 'Column2D') {
        column2D(chartId, chartdata, chartwidth, chartheight);
    }

    if (chartType == 'Line2D' || chartType == 'MultiLine2D' || chartType == 'Area2D' || chartType == 'MultiArea2D' || chartType == 'Scatter2D' || chartType == 'MultiScatter2D' || chartType == 'StepLine2D' || chartType == 'MultiStepLine2D' || chartType == 'MultiStepArea2D' || chartType == 'StepArea2D'
     || chartType == 'Curve2D' || chartType == 'MultiCurve2D' || chartType == 'CurveArea2D' || chartType == 'MultiCurveArea2D') {
        line2D(chartType,chartId, chartdata, chartwidth, chartheight);
    }

    if (chartType == 'Pie2D' || chartType == 'Doughnut2D' || chartType == 'SemiPie2D' || chartType == 'SemiDoughnut2D') {
        pie2D(chartType,chartId, chartdata, chartwidth, chartheight);
    }
    if (chartType == 'Bar2D') {
        bar2D(chartId, chartdata, chartwidth, chartheight);
    }
     if (chartType == 'Availability2D') {
        available2D(chartId, chartdata, chartwidth, chartheight);
    }
    if (chartType == 'Gauge2D') {
        gauge2D(chartId, chartdata, chartwidth, chartheight);
    }
};