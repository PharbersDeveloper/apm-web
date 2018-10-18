import Component from '@ember/component';
import { run } from '@ember/runloop';
import d3 from 'd3';

export default Component.extend({
	init() {
		this._super(...arguments);
		this.set('data', [
			{ a: 1, b: 4, c: 5, d: 5, e: 2, f: 4, name: 'Ann', sum: 21 },
			{ a: 4, b: 6, c: 2, d: 8, e: 10, f: 9, name: "Bob", sum: 39 },
			{ a: 7, b: 2, c: 1, d: 4, e: 5, f: 9, name: "Jean", sum: 28, },
			{ a: 1, b: 4, c: 3, d: 8, e: 9, f: 1, name: "Chuck", sum: 26 },
			{ a: 9, b: 3, c: 2, d: 9, e: 3, f: 3, name: "Denise", sum: 29, },
			{ a: 10, b: 8, c: 9, d: 7, e: 1, f: 2, name: "Eric", sum: 37, },
			{ a: 9, b: 2, c: 4, d: 4, e: 2, f: 9, name: "Frida", sum: 30, },
			{ a: 3, b: 3, c: 1, d: 4, e: 10, f: 9, name: "Greg", sum: 30, },
			{ a: 1, b: 10, c: 6, d: 9, e: 4, f: 4, name: "Hillary", sum: 34 }
		]);
	},
	didReceiveAttrs() {
		this._super(...arguments);
		if (this.get('data')) run.schedule('render', this, this.drawMultiLineChoose);
	},
	drawMultiLineChoose() {
		let localClass = this.get('class');
		let title = this.get('title');
		d3.select('.' + localClass + ' svg.much-lines').remove();
		d3.select('.' + localClass + ' .legendContainer').remove();
		d3.select('.' + localClass + ' text').remove();

		let svgContainer = d3.select(this.element);
		let svg = svgContainer.append("svg").attr('class', 'stacked-bar').style('padding', '0 10px');
		let data = this.get('data');
		let width = 960;
		let height = 340;
		let margin = 20;

		let x_var = "name";

		let alphabet = "abcdef".split("");
		let names = ["Ann", "Bob", "Jean", "Chuck", "Denise", "Eric", "Frida", "Greg", "Hillary"];
		let color = d3.scaleOrdinal(["#3a7ac5", "#5a96db", "#6aa8f0", "#3864c8", "#c7d6e8", "#7f8eb6"])
		let x = d3.scaleBand()
			.rangeRound([0, width])
			.domain(names)
			.padding(.25);

		let y = d3.scaleLinear()
			.rangeRound([height, 0]);

		let x_axis = d3.axisBottom(x);

		let y_axis = d3.axisRight(y)
			.tickSize(width)
			.tickFormat(function(d, i, ticks) { return i == ticks.length - 1 ? d + " value" : d; });

		function customYAxis(g) {
			g.call(y_axis);
			g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
			g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
		}
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(x_axis);

		svg.append("g")
			.attr("class", "y axis")
			.call(customYAxis);

		let stack = d3.stack()
			.keys(alphabet)
			.order(d3.stackOrderNone)
			.offset(d3.stackOffsetNone);

		y.domain([0, d3.max(data.map(function(d) { return d.sum }))]);

		svg.select(".y")
			// .transition()
			.call(customYAxis);

		// each data column (a.k.a "key" or "series") needs to be iterated over
		// the variable alphabet represents the unique keys of the stacks
		alphabet.forEach(function(key, key_index) {

			let bar = svg.selectAll(".bar-" + key)
				.data(stack(data)[key_index], function(d) { return d.data[x_var] + "-" + key; });

			bar //.transition()
				.attr("x", function(d) { return x(d.data[x_var]); })
				.attr("y", function(d) { return y(d[1]); })
				.attr("height", function(d) { return y(d[0]) - y(d[1]); });

			bar.enter().append("rect")
				.attr("class", function(d) { return "bar bar-" + key; })
				.attr("x", function(d) { return x(d.data[x_var]); })
				.attr("y", function(d) { return y(d[1]); })
				.attr("height", function(d) { return y(d[0]) - y(d[1]); })
				.attr("width", x.bandwidth())
				.attr("fill", function(d) { return color(key); })

		});
	}
});