import Component from '@ember/component';
import { run } from '@ember/runloop';
import d3 from 'd3';

export default Component.extend({
	classNames: ['histogram-area-sales', 'col-lg-6', 'col-md-6', 'col-sm-6', 'col-xs-12'],
	init() {
		this._super(...arguments);
		this.data = [{ name: "最差结果", value: 6 }, { name: "上季", value: 7 }, { name: "本季", value: 8 }, { name: "最佳结果", value: 3 }];
	},
	didReceiveAttrs() {
		this._super(...arguments);
		run.schedule('render', this, this.drawHistogramAreaSales);
	},
	drawHistogramAreaSales() {
		let svgContainer = d3.select(this.element);
		let svg = svgContainer.append('svg').attr('class', 'area-sales');
		let areaSalesData = this.get('data');
		let xAxisText = areaSalesData.map((item) => {
			return item.name;
		});
		let yAxisValue = areaSalesData.map((item) => {
			return item.value;
		});
		// 自定义数据
		let width = 600;
		let height = 240;
		// draw  axis
		let x = d3.scaleBand()
			.rangeRound([0, width])
			.domain(xAxisText)
			.padding(.2);
		let yMax = 0;
		for (let i = 0, len = 4; i < len; i++) {
			let max = d3.max(areaSalesData[i], d => { return d.value });
			if (max > yMax) {
				yMax = max
			}
		};
		let y = d3.scaleLinear()
			.range([height, 0])
			.domain([0, 10]);

		let x_axis = d3.axisBottom(x);
		let y_axis = d3.axisLeft(y)
			.tickSize(-width);
		svg.attr("width", "100%")
			.attr("height", 280);
		// .attr('preserveAspectRatio', 'none')
		// .attr('viewBox', '-40 -10 950 380')
		// .append('g');
		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(x_axis);
		svg.append('g')
			.attr('class', 'y axis')
			.call(y_axis);

		let color = d3.scaleOrdinal(['#EA919E', '#A5A8CF', '#A5A8CF', '#FBBF9E'])

		y_axis.tickFormat(function(d, i, ticks) { return i == ticks.length - 1 ? d + " " + 'value' + "s" : d; });
		d3.select(".y.axis").call(y_axis);

		// join
		let bar = svg.selectAll(".bar")
			.data(areaSalesData, function(d) { return d.name; });

		let amount = svg.selectAll(".amount")
			.data(areaSalesData, function(d) { return d.name; });

		// update
		bar
			// .transition()
			.attr("y", function(d) { return y(d.value); })
			.attr("height", function(d) { return height - y(d.value); });

		amount
			// .transition()
			.attr("y", function(d) { return y(d.value); })
			.text(function(d) { return d.value; });

		// enter
		bar.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.name); })
			.attr("y", function(d) { return y(d.value); })
			.attr("width", x.bandwidth())
			// .attr("width", x.bandwidth())
			.attr("height", function(d) { return height - y(d.value); })
			.attr("fill", function(d) { return color(d.name); });

		amount.enter().append("text")
			.attr("class", "amount")
			.attr("x", function(d) { return x(d.name) + x.bandwidth() / 2; })
			.attr("y", function(d) { return y(d.value); })
			.attr("dy", 16)
			.text(function(d) { return d.value; });
	}
});