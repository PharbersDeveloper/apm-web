import Component from '@ember/component';
import { run } from '@ember/runloop';
import { inject } from '@ember/service';
import d3 from 'd3';
import {
	cleanBarLineChart,
	drawRootD3Container,
	drawViewContainer,
	drawBarChart,
	drawLineChart,
	drawDefsChart,
	drawLegendChart
} from './draw';

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
		cleanBarLineChart(this.element, 'svg', '.legendContainer', '._tooltip_1mas67');
		let setting = {
				i18n: this.get('i18n'),
				width: 900,
				height: 340,
				chartId: this.get('chartId'),
				margin: { top: 50, right: 20, bottom: 30, left: 50 },
				backgroundColor: this.get('backgroundColor'),
				laterThreeChangeBg: this.get('laterThreeChangeBg'),
				noLine: this.get('noLine')},
			xDatas = null, values = null,
			xScale = null,  yScale = null,
			yLinxScale = null, maxVal = null,
			lineMaxVal = null, rootD3Container = null,
			viewContainer = null

		xDatas = this.dataset.map(elem => elem.key);
		values = this.dataset.map(elem => elem.value);

		xScale = d3.scaleBand().rangeRound([0, setting.width]).padding(0.1),
		yScale = d3.scaleLinear().rangeRound([setting.height, 0]),
		yLinxScale = d3.scaleLinear().rangeRound([setting.height, 0]);

		maxVal = d3.max(values) * 1.3;
		lineMaxVal = 100;

		xScale.domain(xDatas);
		yScale.domain([0, maxVal]);
		yLinxScale.domain([0, lineMaxVal]);

		rootD3Container = drawRootD3Container(this.element, setting);
		viewContainer = drawViewContainer(rootD3Container, xScale, yScale);

		drawBarChart(rootD3Container, viewContainer, xScale, yScale, this.get('dataset'));
		drawDefsChart(rootD3Container);
		drawLegendChart(this.element);
		if (!this.get('noLine')) {
			drawLineChart(viewContainer, xScale, yLinxScale, this.get('dataset'))
		}
	}
});
