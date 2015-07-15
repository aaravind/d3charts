/**
 * D3 Chart - Line2D Graph
 * Copyright (c) 2015 Aravind Arivarasan, https://github.com/aaravind/d3charts
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
var currentchartdata;
var line2D = function (chartType, chartId, chartdata) {
    function tickspace(datacur) {

        if (chartdata.chart.tickinterval != undefined && chartdata.chart.tickinterval > 1) {
            d3.select(chartId).selectAll(".xtick .tick text").style("display", function (d, i) {
                chartlength = datacur.length - 1;
                ticklength = chartdata.chart.tickinterval - 1;
                if (i == 0)
                    return "block"
                if (i == chartlength)
                    return "block"
                else {
                    if (i % ticklength == 0 && (i < (chartlength - ticklength)))
                        return "block"
                    else
                        return "none"
                }
            });
        }
    }
    if (chartdata.export != undefined && d3.select(chartId + ' select')[0][0] == null) {
        function change() {
            var selectedIndex = select.property('selectedIndex'),
        data = options[0][selectedIndex].__data__;
            if (data != '-Select-') {
                var multitrue = chartType.search("Multi") != -1 ? true : false;
                exportfile(chartId, chartdata, chartType, '.' + data, multitrue);
            }

        }
        if (chartdata.export.showexport == true) {
            var select = d3.select(chartId).append("select").on("change", change).attr('style', 'float:right;position:relative;top:25px ;border: 0px;background-color: #ecf0f1;box-shadow: 0px 1px 2px #cccccc;'),
    options = select.selectAll('option').data(chartdata.export.format); // Data join

            // Enter selection
            options.enter().append("option").text(function (d) {
                return d;
            });


        }
    }

    if (d3.select(chartId).select('svg')[0][0] != null)
        d3.select(chartId).select('svg').remove();
    var bottommargin = chartdata.chart.slant ? 100 : 25;
    var colorfunc = d3.scale.category20c();
    var margin = { top: 20, right: 20, bottom: bottommargin, left: 50 };
    var chartcontent = d3.select(chartId);
    var width = chartcontent[0][0].offsetWidth - margin.left - margin.right;
    var height = chartcontent[0][0].offsetHeight - margin.bottom - margin.top;
    var showlegendwidth = chartdata.chart.showlegend == true ? 30 : 0
    var styleborder = "fill: none; stroke: #000;  shape-rendering: crispEdges;font:12px sans-serif";
    var div = d3.select("body").append("div")
    .attr("style", " position: absolute;opacity:0;text-align: left;width: auto;height: auto;padding: 2px;font: 12px sans-serif;background: white;border: 1px solid lightgrey;border-radius: 8px;pointer-events: none;color:black");
    var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);
    var y = d3.scale.linear()
    .range([height, 0]);
    var xaxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5);
    function xAxis() {
        return d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5)
    }
    function yaxis() {
        return d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5)
          .tickFormat(function (d) {
              var prefix = d3.formatPrefix(d);
              return prefix.scale(d) + prefix.symbol;
          })
    }

    var svg = d3.select(chartId).append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr('viewBox', '0 0 ' + (width + margin.left + margin.right + 40 + showlegendwidth) + ' ' + (height + margin.top + margin.bottom))
        .attr('preserveAspectRatio', 'xMinYMin')
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 5 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("text-decoration", "underline")
        .style("fill", chartdata.chart.captionColor)
        .text(chartdata.chart.caption);
    x.domain(chartdata.data.map(function (d) { return d.label; }));
    y.domain([0, d3.max(chartdata.data, function (d) { return d.value; })]);


    if (chartType == 'MultiLine2D' || chartType == 'MultiArea2D' || chartType == 'MultiScatter2D' || chartType == 'MultiStepLine2D' || chartType == 'MultiStepArea2D' || chartType == 'MultiCurve2D' || chartType == 'MultiCurveArea2D') {

        var dataGroup = d3.nest()
    .key(function (d) {
        return d.category;
    })
    .entries(chartdata.data);
    };

    if (chartdata.chart.slant) {
        if (chartdata.chart.slantdegree != undefined)
            rotatevalue = "rotate(-" + chartdata.chart.slantdegree + ")";
        else
            rotatevalue = "rotate(-" + 65 + ")";
        svg.append("g")
      .attr("style", styleborder)
      .attr("transform", "translate(0," + height + ")")

      .attr("class", "grid xgrid xtick")
      .call(xAxis()
             .innerTickSize(-height)
    .outerTickSize(0)
    .tickPadding(10)
            )
      .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return rotatevalue
            });

    }
    else {
        svg.append("g")
      .attr("style", styleborder)
      .attr("transform", "translate(0," + height + ")")
       .attr("class", "grid xgrid xtick")
      .call(xAxis()
        .innerTickSize(-height)
    .outerTickSize(0)
    .tickPadding(10)
            );


    }
    svg.append("g")
  .attr("class", "grid")
      .call(yaxis()
       .tickSize(-width, 0, 0)
            )

    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("dy", ".71em")
      .attr("text-anchor", "end")
      .text(chartdata.chart.yaxisname);

    d3.selectAll(chartId + " .grid .tick line").style("stroke-width", function (d, i) {
        if (i == 0)
            return 2;
        else
            return 1;
    }
    );
    var dottedlinearr = [];

    if (chartType == 'Line2D' || chartType == 'MultiLine2D' || chartType == 'StepLine2D' || chartType == 'MultiStepLine2D') {
        var valueline = d3.svg.line()
    .defined(function (d, i) {

        if (d.value == 0) {
            if (i == 0 && currentchartdata[i].value == 0) {
                xprev = x(currentchartdata[i].label) + x.rangeBand() / 2;
                yprev = y(currentchartdata[i].value);
            }

            else {

                for (j = i; j > 0; j--) {
                    if (currentchartdata[j - 1].value != 0) {
                        xprev = x(currentchartdata[j - 1].label) + x.rangeBand() / 2;
                        yprev = y(currentchartdata[j - 1].value);

                        break;
                    }

                }

            }


            if (chartType == 'Line2D' || chartType == 'MultiLine2D') {
                if (i + 1 == currentchartdata.length) {
                    xnext = x(currentchartdata[i].label) + x.rangeBand() / 2;
                    ynext = y(currentchartdata[i].value);
                    dottedlinearr.push('M' + xprev + ',' + yprev + 'L' + xnext + ',' + ynext);
                }

                else {

                    for (j = i; j < currentchartdata.length; j++) {
                        if (currentchartdata[j + 1].value != 0) {
                            xnext = x(currentchartdata[j + 1].label) + x.rangeBand() / 2;
                            ynext = y(currentchartdata[j + 1].value);
                            dottedlinearr.push('M' + xprev + ',' + yprev + 'L' + xnext + ',' + ynext);
                            break;
                        }

                    }

                }

            }
            else {
                if (i == 0) {
                    xnext1 = x(currentchartdata[i + 1].label) + x.rangeBand() / 2;
                    xnext2 = x(currentchartdata[i + 1].label) + x.rangeBand() / 2;
                    ynext1 = y(currentchartdata[i].value);
                    ynext2 = y(currentchartdata[i + 1].value);
                    dottedlinearr.push('M' + xprev + ',' + yprev + 'L' + xnext1 + ',' + ynext1 + 'L' + xnext2 + ',' + ynext2);
                }
                else if (i + 1 == currentchartdata.length) {
                    xnext1 = x(currentchartdata[i].label) + x.rangeBand() / 2;
                    xnext2 = x(currentchartdata[i].label) + x.rangeBand() / 2;
                    ynext1 = y(currentchartdata[i - 1].value);
                    ynext2 = y(currentchartdata[i].value);
                    dottedlinearr.push('M' + xprev + ',' + yprev + 'L' + xnext1 + ',' + ynext1 + 'L' + xnext2 + ',' + ynext2);
                }
                else {
                    var count = 0;
                    var yval;
                    for (j = i; j >= 0; j--) {
                        if (j == 0)
                            yval = y(currentchartdata[j].value);
                        else {
                            if (currentchartdata[j - 1].value != 0) {
                                yval = y(currentchartdata[j - 1].value);
                                break;
                            }
                        }

                    }
                    for (j = i; j <= currentchartdata.length; j++) {
                        if (j == currentchartdata.length - 1) {

                            xnext1 = x(currentchartdata[j].label) + x.rangeBand() / 2;
                            xnext2 = x(currentchartdata[j].label) + x.rangeBand() / 2;
                            ynext1 = yval;
                            ynext2 = y(currentchartdata[j].value);
                            dottedlinearr.push('M' + xprev + ',' + yprev + 'L' + xnext1 + ',' + ynext1 + 'L' + xnext2 + ',' + ynext2);
                            break;
                        }
                        else {
                            if (currentchartdata[j + 1].value != 0) {
                                xnext1 = x(currentchartdata[j + 1].label) + x.rangeBand() / 2;
                                xnext2 = x(currentchartdata[j + 1].label) + x.rangeBand() / 2;
                                ynext1 = yval;
                                ynext2 = y(currentchartdata[j + 1].value);
                                dottedlinearr.push('M' + xprev + ',' + yprev + 'L' + xnext1 + ',' + ynext1 + 'L' + xnext2 + ',' + ynext2);
                                break;
                            }
                        }

                    }

                }
            }

            return false;
        }

        else
            return true;
    })
    .x(function (d) {
        return x(d.label) + x.rangeBand() / 2;
    })
    .y(function (d) {
        return y(d.value);
    });
    }
    else {
        if (chartType == "Curve2D" || chartType == "MultiCurve2D") {
            var valueline = d3.svg.line()
    .x(function (d) {
        return x(d.label) + x.rangeBand() / 2;
    })
    .y(function (d) {
        return y(d.value);
    });
        }
        else {
            var valueline = d3.svg.line()
    .defined(function (d) {
        return d.value != 0;
    })
    .x(function (d) {
        return x(d.label) + x.rangeBand() / 2;
    })
    .y(function (d) {
        return y(d.value);
    });
        }



    }

    if (chartType == 'StepLine2D' || chartType == 'MultiStepLine2D') {
        valueline.interpolate('step-after');
    }
    if (chartType == 'Curve2D' || chartType == 'MultiCurve2D') {
        valueline.interpolate('cardinal');
    }

    if (chartType == 'Line2D' || chartType == 'StepLine2D' || chartType == 'Curve2D') {
        currentchartdata = chartdata.data;
        dottedlinearr = [];
        var color = chartdata.chart.pallattecolor[0];
        var path = svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(chartdata.data))
        .attr("style", 'stroke:' + color + ';fill:none;');
        for (i = 0; i < dottedlinearr.length; i++) {
            svg.append("path")
        .attr("class", "line")
        .attr("d", dottedlinearr[i])
        .attr("style", 'stroke:' + color + ';fill:none;')
        .style("stroke-dasharray", ("3, 3"));
        }
        drawCircle(chartType, chartdata.data, color, chartType);
        var totalLength = path.node().getTotalLength();

        path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(1000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
        tickspace(chartdata.data);
    }

    else if (chartType == 'Scatter2D') {
        var color = chartdata.chart.pallattecolor[0];
        drawCircle('Scatter2D', chartdata.data, color, chartType);
        tickspace(chartdata.data);
    }

    else if (chartType == 'MultiScatter2D') {
        dataGroup.forEach(function (d, i) {
            var color = chartdata.chart.pallattecolor[i];
            var keyid = d.key;
            var colorstyle = 'stroke:' + color + ';display:none';

            var path = svg.append('path')
        .attr('d', valueline(d.values))
         .attr("class", chartType + keyid.replace(/\s+/g, '') + ' line')
          .attr("data-visibilitypath", "true")
           .attr("data-categorycolumn", d.key)
        .attr('style', colorstyle);

            drawCircle('MultiScatter2D', d.values, color, d.key);

        });
        tickspace(dataGroup[0].values);
        if (chartdata.chart.showlegend) {
            var legend = svg.selectAll('.legend')
        .data(dataGroup)
        .enter()
      .append('g')
        .attr('class', 'legend');
            legend.append('rect')
        .attr('x', width)
        .attr('y', function (d, i) { return (i + 1) * 20; })
        .attr('width', 10)
        .attr('height', 10)
        .style('opacity', 1)
        .style('fill', function (d, i) {
            return chartdata.chart.pallattecolor[i];
        });

            legend.append('text')
        .attr('x', width + 12)
        .attr('y', function (d, i) { return ((i + 1) * 20) + 9; })
        .text(function (d) { return d.key; })
        .style('fill', function (d, i) {
            return chartdata.chart.pallattecolor[i]
        })
         .on("click", function (d, i) {
             var graphselect = chartType + d.key.replace(/\s+/g, '');
              this.parentElement.getElementsByTagName('rect')[0].style.opacity = 0.5;
             if (d3.selectAll('.circletext.' + graphselect).style('display') == 'inline') {
                 d3.selectAll('.' + graphselect).attr("data-visibilitypath", "false");
                 d3.selectAll('.circletext.' + graphselect).style('display', 'none');
             }

             else {
                  this.parentElement.getElementsByTagName('rect')[0].style.opacity = 1;
                 d3.selectAll('.' + graphselect).attr("data-visibilitypath", "true");
                 d3.selectAll('.circletext.' + graphselect).style('display', 'inline');
             }

         })
         .on("mouseover", function (d, i) {
             this.style.cursor = 'pointer';
         });

        }
    }

    else if (chartType == 'Area2D' || chartType == 'StepArea2D' || chartType == 'CurveArea2D') {
        var color = chartdata.chart.pallattecolor[0];
        var area = d3.svg.area()
    .x(function (d) {
        return x(d.label) + x.rangeBand() / 2;
    })
    .y0(height)
    .y1(function (d) {
        return y(d.value);
    });
        if (chartType == "StepArea2D") {
            area.interpolate('step-after');
        }
        if (chartType == "CurveArea2D") {
            area.interpolate('cardinal');
        }
        svg.append("path")
    .datum(chartdata.data)
        .attr("style", "stroke:transparent ;fill:" + color + ";opacity:.8")
        .attr("d", area);
        svg.selectAll('.xgrid').selectAll('line')
          .style("stroke-dasharray", ("3, 3"))
               .style("opacity", 0)
                .style("stroke-width", 3);
        tickspace(chartdata.data);
    }
    else if (chartType == 'MultiLine2D' || chartType == 'MultiStepLine2D' || chartType == 'MultiCurve2D') {
        dataGroup.forEach(function (d, i) {
            dottedlinearr = [];
            var color = chartdata.chart.pallattecolor[i];
            var keyid = d.key;
            var colorstyle = 'stroke:' + color + ';fill:none';
            currentchartdata = d.values;
            var path = svg.append('path')
        .attr('d', valueline(d.values))
         .attr("class", chartType + keyid.replace(/\s+/g, '') + ' line')
          .attr("data-visibilitypath", "true")
           .attr("data-categorycolumn", d.key)
        .attr('style', colorstyle);

            for (i = 0; i < dottedlinearr.length; i++) {
                svg.append("path")
        .attr("class", "line")
        .attr("d", dottedlinearr[i])
          .attr("class", chartType + keyid.replace(/\s+/g, '') + ' line')
          .attr("data-visibilitypath", "true")
           .attr("data-categorycolumn", d.key)
        .attr("style", colorstyle)
        .style("stroke-dasharray", ("3, 3"));
            }

            drawCircle(chartType, d.values, color, d.key);
        });
        tickspace(dataGroup[0].values);
        if (chartdata.chart.showlegend) {
            var legend = svg.selectAll('.legend')
        .data(dataGroup)
        .enter()
      .append('g')
        .attr('class', 'legend');
            legend.append('rect')
        .attr('x', width)
        .attr('y', function (d, i) { return (i + 1) * 20; })
        .attr('width', 10)
        .attr('height', 10)
        .style('opacity',1)
        .style('fill', function (d, i) {
            return chartdata.chart.pallattecolor[i];
        });

            legend.append('text')
        .attr('x', width + 12)
        .attr('y', function (d, i) { return ((i + 1) * 20) + 9; })
        .text(function (d) { return d.key; })
        .style('fill', function (d, i) {
            return chartdata.chart.pallattecolor[i]
        })
        .on("click", function (d, i) {
            var graphselect = chartType + d.key.replace(/\s+/g, '');
            this.parentElement.getElementsByTagName('rect')[0].style.opacity = 0.5;
            if (d3.selectAll('.' + graphselect).style('display') == 'inline') {
                d3.selectAll('.' + graphselect).style('display', 'none');
                d3.selectAll('.' + graphselect).attr("data-visibilitypath", "false");

            }

            else {
                this.parentElement.getElementsByTagName('rect')[0].style.opacity = 1;
                d3.selectAll('.' + graphselect).style('display', 'inline');
                d3.selectAll('.' + graphselect).attr("data-visibilitypath", "true");
            }

        })
         .on("mouseover", function (d, i) {
             this.style.cursor = 'pointer';
         });
        }
    }

    else {
        var area = d3.svg.area()
    .x(function (d) {
        return x(d.label) + x.rangeBand() / 2;
    })
    .y0(height)
    .y1(function (d) {
        return y(d.value);
    });
        if (chartType == "MultiStepArea2D")
            area.interpolate('step-after');
        if (chartType == "MultiCurveArea2D")
            area.interpolate('cardinal');
        dataGroup.forEach(function (d, i) {
            var color = chartdata.chart.pallattecolor[i];
            var colorstyle = 'stroke:' + color;
            var keyid = d.key;
            svg.append("path")
    .datum(d.values)
        .attr("style", "stroke:transparent;fill:" + color + ";opacity:0.5")
        .attr("d", area)
        .attr("data-visibilitypath", "true")
         .attr("data-categorycolumn", d.key)
        .attr("class", chartType + keyid.replace(/\s+/g, ''));
            svg.selectAll('.xgrid').selectAll('line')
          .style("stroke-dasharray", ("3, 3"))
          .style("opacity", 0)
           .style("stroke-width", 3);

        });
        tickspace(dataGroup[0].values);
        if (chartdata.chart.showlegend) {
            var legend = svg.selectAll('.legend')
        .data(dataGroup)
        .enter()
      .append('g')
        .attr('class', 'legend');
            legend.append('rect')
        .attr('x', width)
        .attr('y', function (d, i) { return (i + 1) * 20; })
        .attr('width', 10)
        .attr('height', 10)
        .style('opacity',1)
        .style('fill', function (d, i) {
            return chartdata.chart.pallattecolor[i];
        });

            legend.append('text')
        .attr('x', width + 12)
        .attr('y', function (d, i) { return ((i + 1) * 20) + 9; })
        .text(function (d) { return d.key; })
        .style('fill', function (d, i) {
            return chartdata.chart.pallattecolor[i]
        })
         .on("click", function (d, i) {
             var graphselect = chartType + d.key.replace(/\s+/g, '');
             this.parentElement.getElementsByTagName('rect')[0].style.opacity = 0.5;
             if (d3.selectAll('.' + graphselect).style('display') == 'inline') {
                 d3.selectAll('.' + graphselect).style('display', 'none');
                 d3.selectAll('.' + graphselect).attr("data-visibilitypath", "false");
             }

             else {
                 this.parentElement.getElementsByTagName('rect')[0].style.opacity = 1;
                 d3.selectAll('.' + graphselect).style('display', 'inline');
                 d3.selectAll('.' + graphselect).attr("data-visibilitypath", "true");
             }

         })
         .on("mouseover", function (d, i) {
             this.style.cursor = 'pointer';
         });
        }
    }


    function drawCircle(cType, cData, color, id) {

        var circletext = svg.selectAll('circletext')
     .data(cData)
    .enter().append('g')
    .attr('class', 'circletext ' + cType + id.replace(/\s+/g, ''));
        circletext.append('circle')
    .attr("class", function (d) { return cType + d.label })
    .style("fill", function (d, i) { return d.value == 0 ? "none" : color; })
    .style("opacity", '0.3')
    .on("mouseover", function (d, i) {
        this.style.opacity = 1;
        div.transition()
                .duration(0)
                .style("opacity", .9);
        var xattr = bodyRect = elemRect = yattr = 0;
        // var xattr = ((this.getAttribute('cx') / 1) + (this.getAttribute('width') / 1) + margin.left / 2) + 'px';
        var bodyRect = document.body.getBoundingClientRect();
        var elemRect = this.getBoundingClientRect();
        //  var yattr = (elemRect.top - bodyRect.top- margin.top/2) + 'px';


        var xattr = (elemRect.left - bodyRect.left - margin.left / 2 + 10) + 'px';
        //    var yattr = (elemRect.top - bodyRect.top - margin.top +5) + 'px';
        var yattr = document.getElementById(chartId.replace("#", "")).offsetTop + (this.getAttribute('cy') / 1 + 7) + 'px';

        div.html(this.nextSibling.textContent)
       .style("left", xattr)
                .style("top", yattr)
                 .style("margin-top", "35px");



    })
        .on("mouseout", function (d, i) {
            this.style.opacity = 0.3;
            div.transition()
                .duration(0)
                .style("opacity", 0);

        })
    .attr("cx", function (d)
    { return x(d.label) + x.rangeBand() / 2; })
     .attr("cy", function (d) { return y(d.value); })
     .attr("r", 5);


        circletext.append('text')
    .attr("dx", function (d)
    { return x(d.label) + x.rangeBand() / 2 + 10; })
     .attr("dy", function (d) { return y(d.value) - 5; })
      .attr("class", function (d) { return cType + d.label.replace(" ", "") })
	    .text(function (d) {
	        if (chartType == 'Line2D' || chartType == 'Scatter2D' || chartType == 'StepLine2D' || chartType == 'Curve2D')
	            return d.label + ':' + d.value;
	        else
	            return d.category + ':' + d.value;
	    })
        .attr('style', function (d) {
            var colorval = (d.value == 0) ? "grey" : color;
            return 'display:none;z-index:9999999;fill:' + colorval + ';font-size:15px'
        });

        svg.selectAll(chartId + ' .xgrid').selectAll('line')
          .style("stroke-dasharray", 3)
          .style("stroke-width", 3)
          .style("cursor", "pointer")
         .style("opacity", "0")
         .on('mouseover', function (d, i) {
             if (chartType != 'Line2D' && chartType != 'Curve2D' && chartType != 'Area2D' && chartType != 'StepLine2D' && chartType != 'Scatter2D') {
                 d3.select(this)
         .transition()
         .duration(0)
         .attr('stroke', 'grey')
        .style("stroke-dasharray", 0)
      .style("opacity", "0.8")
                 d3.selectAll('.' + cType + d.replace(" ", ""))
        .attr("r", 8)
        .transition()
         .duration(0)
         .style('opacity', 1);

                 var alltext = d3.selectAll('text' + '.' + cType + d.replace(" ", ""));
                 if (chartType.search('Multi') == -1)
                     var htmlcontent = '';
                 else {
                     if (chartdata.chart.tooltipheader == undefined || chartdata.chart.tooltipheader == '')
                         var htmlcontent = '<span style=\"height:10px!important\">Node: ' + d + '</span><hr>';
                     else
                         var htmlcontent = '<span style=\"height:10px!important\">' + chartdata.chart.tooltipheader + ': ' + d + '</span><hr>';
                 }

                 if (this.getBoundingClientRect().left < window.innerWidth / 2) {
                     for (i = 0; i < alltext[0].length; i++)
                         htmlcontent = htmlcontent + '<span style=\'float:left\'>' + '<div style=\'background:' + alltext[0][i].style.fill + ';color:black;border-radius:50%;width:10px;height:10px;margin-top:1px\'></div>' + '</span>' + '<span style=\'margin-left:10px;float:left\'>' + alltext[0][i].textContent + '</span>' + '<br>';
                 }
                 else {
                     for (i = 0; i < alltext[0].length; i++)
                         htmlcontent = htmlcontent + '<span style=\'float:right\'>' + '<div style=\'background:' + alltext[0][i].style.fill + ';color:black;border-radius:50%;width:10px;height:10px;margin-top:1px\'></div>' + '</span>' + '<span style=\'margin-right:10px;float:right\'>' + alltext[0][i].textContent + '</span>' + '<br>';
                 }


                 div.transition()
                .duration(0)
                .style("opacity", .9);

                 var xattr = bodyRect = elemRect = yattr = 0;
                 var bodyRect = document.body.getBoundingClientRect();
                 var elemRect = this.getBoundingClientRect();
                 if (elemRect.left > window.innerWidth / 2)
                     var xattr = (elemRect.left - bodyRect.left - div[0][0].offsetWidth) + 'px';
                 else
                     var xattr = (elemRect.left - bodyRect.left + 10) + 'px';
                 var yattr = (elemRect.top - bodyRect.top + height / 2 - margin.top / 2 - margin.bottom / 2) + 'px';
                 //var xattr = (elemRect.left - bodyRect.left - elemRect.left/2) + 'px';
                 div.html(htmlcontent)
       .style("left", xattr)
                .style("top", yattr);
             }

         })
          .on('mouseout', function (d) {
              if (chartType != 'Line2D' && chartType != 'Curve2D' && chartType != 'Area2D' && chartType != 'StepLine2D') {
                  d3.select(this)
          .transition()
         .duration(0)
         .attr('stroke', '')
          .style("opacity", "0")
         .style("stroke-dasharray", 3)
                  d3.selectAll('.' + cType + d.replace(" ", ""))
              .style('opacity', 0.3)
         .attr("r", 5)
          .transition()
         .duration(0);
                  div.transition()
                .duration(0)
                .style("opacity", 0);
              }
          });


    };


}