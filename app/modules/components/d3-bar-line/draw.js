
import d3 from 'd3';

let variable = {};

const drawTipContent = function (tipContainer, barObject, val) {
	let xCoordinate = parseFloat(d3.select(barObject).attr('x')),
		yCoordinate = parseFloat(d3.select(barObject).attr('y'));

	tipContainer.selectAll('rect').remove()
	tipContainer.selectAll('text').remove()
	tipContainer.selectAll('tspan').remove()
	tipContainer.append('rect')
		.attr('x', xCoordinate)
		.attr('y', yCoordinate - 50)
		.attr('rx', '5')
		.attr('ry', '5')
		.attr('opacity', 1)
		.attr('width', 70)
		.attr('height', 50)
		.attr('fill', '#FFF')
		.attr('class', '_tooltip_1mas67')
	let text = tipContainer.append('text')
		.attr('x', xCoordinate)
		.attr('y', yCoordinate - 50 + 12)
		.style('font-size', '10px')
	text.append('tspan').text(val.key)
		.attr('x', xCoordinate + 2)
		.attr('y', yCoordinate - 50 + 12 + 5)
	text.append('tspan').text(`${variable.i18n.t('apm.component.d3BarLine.share')}: ${val.value2}%`)
		.attr('x', xCoordinate + 2)
		.attr('y', yCoordinate - 50 + 12 + 15)
	text.append('tspan').text(`${variable.i18n.t('apm.component.d3BarLine.sales')}: ${val.value}`)
		.attr('x', xCoordinate + 2)
		.attr('y', yCoordinate - 50 + 12 + 25)
}

const cleanBarLineChart = function(element, ...keys) {
	let rootD3ChartObject =  d3.select(element);
	keys.forEach(key => {
		rootD3ChartObject.selectAll(key).remove();
	})
}

const drawRootD3Container = function(element, option) {
	variable = option;

	let svg = d3.select(element).append('svg')
		.attr('class', 'istogram-container')
		.attr('preserveAspectRatio', 'none')
		.attr('viewBox', '0 0 960 420')
		.style('min-height', '420px')
		.style('background-color', option.backgroundColor)
		.style('padding', '0 0');

	return svg;
}

const drawTipContainer = function(viewContainer) {
	return viewContainer.append('g').style("opacity", 0.0);
}

const drawViewContainer = function(rootD3Container, xScale, yScale) {
	let gContainer = rootD3Container.append('g')
		.attr('transform', `translate(${variable.margin.left}, ${variable.margin.top})`);

	gContainer
		.attr('class', 'container-g')
		.append('text')
		.attr('transform', 'translate(' + (variable.width / 2) + ',' + (-variable.margin.top / 2) + ')')
		.attr('text-anchor', 'middle')
		.attr('font-weight', 600)
		.text(variable.title);

	gContainer.append('g')
		.attr('class', 'axisX')
		.attr('transform', 'translate(-14,' + variable.height + ')')
		.call(d3.axisBottom(xScale))
		.attr('font-weight', 'bold');

	gContainer.append('g')
		.attr('class', 'axisY')
		.call(d3.axisLeft(yScale).ticks(10));

	return gContainer;
}

const drawBarChart = function(rootD3Container, viewContainer, xScale, yScale, dataset) {
	let tipContainer = drawTipContainer(viewContainer);
	let barChart = viewContainer.selectAll('bar')
		.data(dataset)
		.enter().append('g');

	barChart.append('rect')
		.attr('height', function (d) { return variable.height - yScale(d.value); })
		.attr('x', function (d) { return xScale(d.key); })
		.attr('y', function (d) { return yScale(d.value); })
		.attr('width', xScale.bandwidth() / 2)
		.attr('class', '_bar_1mas67')
		.on('mouseover', function(d) {
			drawTipContent(tipContainer, this, d);
			tipContainer.style("opacity", 1);
			d3.select(this).attr('opacity', 0.7);
		})
		.on('mouseout', function() {
			tipContainer.style("opacity", 0.0);
			d3.select(this).attr('opacity', 1)
		})

		if (variable.laterThreeChangeBg) {
			rootD3Container
				.selectAll('.container-g')
				.selectAll('g:nth-last-of-type(3)')
				.select('rect')
				.style("fill", "url(#" + variable.chartId + "linearColor" + ")");

			rootD3Container
				.selectAll('.container-g')
				.selectAll('g:nth-last-of-type(2)')
				.select('rect')
				.style("fill", "url(#" + variable.chartId + "linearColor" + ")");

			rootD3Container
				.selectAll('.container-g')
				.selectAll('g:last-of-type')
				.select('rect')
				.style("fill", "url(#" + variable.chartId + "linearColor" + ")");

		}
}

const drawLineChart = function(dataset) {

}

const drawDefsChart = function(rootD3Container) {
	let defs = rootD3Container.append("defs")

	let linearGradient = defs.append("linearGradient")
		.attr("id", variable.chartId + "linearColor")
		.attr("x1", "0%")
		.attr("y1", "0%")
		.attr("x2", "0%")
		.attr("y2", "100%");

	linearGradient.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", '#FFE68C');

	linearGradient.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", '#E9A782');
}

const drawLegendChart = function(element) {
	let legendContainer = null, legendArea = null, legendData = null, legend = null;
	legendContainer = d3.select(element).append('div')
		.attr('class', 'legendContainer')
		.style('text-align', 'center')

	legendArea = legendContainer.append("svg")
		.attr('class', 'legendArea')
		.attr('width', 240)
		.attr('height', 20)

	legendData = [variable.i18n.t('apm.component.d3BarLine.share') + "", variable.i18n.t('apm.component.d3BarLine.sales') + ""];

	if (variable.laterThreeChangeBg) {
		if (variable.noLine) {
			legendData = [variable.i18n.t('apm.component.d3BarLine.sales') + "", variable.i18n.t('apm.component.d3BarLine.forecastSales') + ""];
		} else {
			legendData = [variable.i18n.t('apm.component.d3BarLine.share') + "", variable.i18n.t('apm.component.d3BarLine.sales') + "", variable.i18n.t('apm.component.d3BarLine.forecastSales') + ""];
		}
	} else {
		if (variable.noLine) {
			legendData = [variable.i18n.t('apm.component.d3BarLine.sales') + ""];
		} else {
			legendData = [variable.i18n.t('apm.component.d3BarLine.share') + "", variable.i18n.t('apm.component.d3BarLine.sales') + ""];
		}
	}

	legend = legendArea.selectAll("g")
			.data(legendData)
			.enter()
			.append("g")
			.attr("transform", function (d, i) {
				return "translate(" + parseInt(i * 120) + ",0)";
			});
	legend.append("rect")
		.attr("x", 10)
		.attr("y", 5)
		.attr('width', function (d) {
			if (d == variable.i18n.t('apm.component.d3BarLine.share') + "") {
				return 20;
			} else {
				return 10;
			}
		})
		.attr('height', function (d) {
			if (d == variable.i18n.t('apm.component.d3BarLine.share') + "") {
				return 5;
			} else {
				return 30;
			}
		})
		.style("fill", function (d) {
			if (d == variable.i18n.t('apm.component.d3BarLine.share') + "") {
				return '#FA6F80';
			} else if (d == variable.i18n.t('apm.component.d3BarLine.sales') + "") {
				return '#4A90E2';
			} else {
				return '#F5A623';
			}
		}).attr("transform", function (d) {
			if (d == variable.i18n.t('apm.component.d3BarLine.share') + "") {
				return "translate(0 ,5)";
			}
		});
		legend.append("text")
			.attr("x", 40)
			.attr("y", 12)
			.style("fill", '#485465')
			.style('font-size', '14px')
			.attr("dy", ".35em")
			.text(function (d) {
				return d;
			});
}



export {
	cleanBarLineChart,
	drawRootD3Container,
	drawViewContainer,
	drawBarChart,
	drawDefsChart,
	drawLegendChart
}
