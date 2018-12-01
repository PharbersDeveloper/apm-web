import Component from '@ember/component';
import { run } from '@ember/runloop';
import { inject } from '@ember/service';
import d3 from 'd3';

export default Component.extend({
	i18n: inject(),
	chartId: '',
	localClassNames: 'bar-line-container',
	backgroundColor: '#FFF',
	laterThreeChangeBg: false,
	title: '',
	dataset: [],
	noLine: false,
	didReceiveAttrs() {
		if (this.get('chartId') === '') {
			throw 'chartId is null or undefinde, please set value';
		} else {
			if (this.dataset) run.scheduleOnce('render', this, this.drawChart);
		}
	},
	drawChart() {
		let that = this;
		const parent = d3.select(this.element);
		parent.selectAll("svg").remove();
		parent.select('.legendContainer').remove();
		parent.select('._tooltip_1mas67').remove();


		let width = 900;
		let height = 340;
		let margin = { top: 50, right: 20, bottom: 30, left: 50 };

		let xDatas = this.dataset.map(elem => elem.key);
		let values = this.dataset.map(elem => elem.value);
		let values2 = this.dataset.map(elem => elem.value2);

		let xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
			yScale = d3.scaleLinear().rangeRound([height, 0]),
			yScale2 = d3.scaleLinear().rangeRound([height, 0]);
		let noLine = this.get('noLine');
		xScale.domain(xDatas);
		let maxVal = d3.max(values) * 1.3
		// let maxVal2 = d3.max(values2) * 3;
		let maxVal2 = 100;
		yScale.domain([0, maxVal]);
		yScale2.domain([0, maxVal2]);
		let svgContainer = d3.select(this.element);

		// let svgContainer = d3.select(`#${this.get('chartId')}`);
		let tooltip = svgContainer.append('div').attr("class", "_tooltip_1mas67").style("opacity", 0.0);
		let svg = svgContainer.append("svg")
			.attr('class', 'histogram-container')
			.attr('min-height', '420px')
			.style('background-color', this.get('backgroundColor'))
			.style('padding', '0 0')
			.attr('preserveAspectRatio', 'none')
			.attr('viewBox', '0 0 960 420')

		// svg.attr("width", "100%")
		// .attr("height", 380)
		// .attr('preserveAspectRatio', 'none')
		// .attr('viewBox', '-30 10 950 380')
		// .append('g');
		let g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		// g.attr('class', '_container-g_1mas67')
		g.attr('class', 'container-g')

			.append('text')
			.attr('transform', 'translate(' + (width / 2) + ',' + (-margin.top / 2) + ')')
			.attr('text-anchor', 'middle')
			.attr('font-weight', 600)
			.text(this.get('title'));

		g.append('g')
			.attr('class', 'axisX')
			.attr('transform', 'translate(-14,' + height + ')')
			.call(d3.axisBottom(xScale))
			.attr('font-weight', 'bold');

		g.append('g')
			.attr('class', 'axisY')
			.call(d3.axisLeft(yScale).ticks(10));
		if (!noLine) {
			g.append('g')
				.attr('class', 'axisY')
				.attr('transform', 'translate(' + (width - margin.right) + ', 0)')
				.call(d3.axisRight(yScale2).ticks(10));
		}


		let chart = g.selectAll('bar')
			.data(this.dataset)
			.enter().append('g');

		/**
		 * 渐变开始
		 */
		var defs = svg.append("defs")

		var linearGradient = defs.append("linearGradient")
			.attr("id", this.get('chartId') + "linearColor")
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

		/**
		 * 渐变结束
		 */
		chart.append('rect')
			.attr('height', function (d) { return height - yScale(d.value); })
			.attr('x', function (d) { return xScale(d.key); })
			.attr('y', function (d) { return yScale(d.value); })
			.attr('width', xScale.bandwidth() / 2)
			.attr('class', '_bar_1mas67')

		// chart.append('text')
		// 	.attr('class', '_barText_1mas67')
		// 	.attr('x', function(d) { return xScale(d.key); })
		// 	.attr('y', function(d) { return yScale(d.value); })
		// 	.attr('dx', xScale.bandwidth() / 4)
		// 	.attr('dy', 20)
		// 	.attr('text-anchor', 'middle')
		// 	.text(function(d) { return d.value; });

		if (this.get('laterThreeChangeBg')) {
			// d3.select(`#${this.get('chartId')}`)
			svgContainer
				// .selectAll('._container-g_1mas67')
				.selectAll('.container-g')
				.selectAll('g:nth-last-of-type(3)')
				.select('rect')
				.style("fill", "url(#" + this.get('chartId') + "linearColor" + ")");

			// d3.select(`#${this.get('chartId')}`)
			svgContainer
				// .selectAll('._container-g_1mas67')
				.selectAll('.container-g')
				.selectAll('g:nth-last-of-type(2)')
				.select('rect')
				.style("fill", "url(#" + this.get('chartId') + "linearColor" + ")");

			// d3.select(`#${this.get('chartId')}`)
			svgContainer
				// .selectAll('._container-g_1mas67')
				.selectAll('.container-g')
				.selectAll('g:last-of-type')
				.select('rect')
				.style("fill", "url(#" + this.get('chartId') + "linearColor" + ")");

		}

		let line = d3.line()
			.x(function (d) { return xScale(d.key); })
			.y(function (d) { return yScale2(d.value2); });
		if (!noLine) {
			g.append("path")
				.datum(this.dataset)
				.attr("fill", "none")
				.attr("stroke", "#FF8190")
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("transform", "translate(" + xScale.bandwidth() / 4 + ",0)")
				.attr("stroke-width", 1.5)
				.attr("d", line);
		}
		// Line


		chart.on('mouseover', function (d) {
			tooltip.style("opacity", 1.0);
			tooltip.html(d.key + "<br>" + that.get('i18n').t('apm.component.d3BarLine.share') + "" + "：" + d.value2 + "%" + "<br>" + that.get('i18n').t('apm.component.d3BarLine.sales') + "" + "：" + d.value)
				.style("left", (d3.event.clientX + 20) + "px")
				.style("top", (d3.event.clientY) + "px")

			d3.select(this).attr('opacity', 0.7);
		}).on('mouseout', function (d) {
			tooltip.style("opacity", 0.0);
			d3.select(this).attr('opacity', 1)
		});

		//绘制图例区域
		let legendContainer = svgContainer.append('div').attr('class', 'legendContainer')
			.style('text-align', 'center');
		var legendArea = legendContainer.append("svg")
			// .attr('preserveAspectRatio', 'xMidYMid meet')
			// .attr('viewBox', '0 0 960 20')
			.attr('class', 'legendArea')
			.attr('width', 240)
			.attr('height', 20)

		let legendData = [this.get('i18n').t('apm.component.d3BarLine.share') + "", this.get('i18n').t('apm.component.d3BarLine.sales') + ""];
		if (this.get('laterThreeChangeBg')) {
			if (noLine) {
				legendData = [this.get('i18n').t('apm.component.d3BarLine.sales') + "", this.get('i18n').t('apm.component.d3BarLine.forecastSales') + ""];
			} else {
				legendData = [this.get('i18n').t('apm.component.d3BarLine.share') + "", this.get('i18n').t('apm.component.d3BarLine.sales') + "", this.get('i18n').t('apm.component.d3BarLine.forecastSales') + ""];
			}
		} else {
			if (noLine) {
				legendData = [this.get('i18n').t('apm.component.d3BarLine.sales') + ""];
			} else {
				legendData = [this.get('i18n').t('apm.component.d3BarLine.share') + "", this.get('i18n').t('apm.component.d3BarLine.sales') + ""];
			}
		}
		var legend = legendArea.selectAll("g")
			.data(legendData)
			.enter()
			.append("g")
			.attr("transform", function (d, i) {
				// return "translate(" + parseInt(i * 2 + 2) * 100 + ",0)";
				return "translate(" + parseInt(i * 120) + ",0)";

			});

		//添加图例的矩形色块
		legend.append("rect")
			.attr("x", 10)
			.attr("y", 5)
			.attr('width', function (d, i) {
				if (d == that.get('i18n').t('apm.component.d3BarLine.share') + "") {
					return 20;
				} else {
					return 10;
				}
			})
			.attr('height', function (d, i) {
				if (d == that.get('i18n').t('apm.component.d3BarLine.share') + "") {
					return 5;
				} else {
					return 30;
				}
			})
			.style("fill", function (d, i) {
				if (d == that.get('i18n').t('apm.component.d3BarLine.share') + "") {
					return '#FA6F80';
				} else if (d == that.get('i18n').t('apm.component.d3BarLine.sales') + "") {
					return '#4A90E2';
				} else {
					return '#F5A623';
				}
			}).attr("transform", function (d, i) {
				if (d == that.get('i18n').t('apm.component.d3BarLine.share') + "") {
					return "translate(0 ,5)";
				}
			});

		//添加图例文字
		legend.append("text")
			.attr("x", 40)
			.attr("y", 12)
			.style("fill", '#485465')
			.style('font-size', '14px')
			.attr("dy", ".35em")
			.text(function (d, i) {
				return d;
			});

	}
});
