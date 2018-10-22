import Component from '@ember/component';
import { run } from '@ember/runloop';
import d3 from 'd3';
export default Component.extend({
	tagName: 'div',
	classNames: ['multilines'],

	didReceiveAttrs() {
		this._super(...arguments);
		if (this.get('chooseData')) run.schedule('render', this, this.drawMultiLine);
	},
	drawMultiLine() {
		let localClass = this.get('class');
		let title = this.get('title');
		d3.select('.' + localClass + ' svg.much-lines').remove();
		d3.select('.' + localClass + ' .legendContainer').remove();
		d3.select('.' + localClass + ' text').remove();

		let svgContainer = d3.select(this.element);
		let svg = svgContainer.append("svg").attr('class', 'much-lines').style('padding', '0 10px');
		let chooseData = this.get('chooseData');
		let width = 900;
		let height = 340;
		let margin = 20;

		let lineOpacity = "0.45";
		let lineOpacityHover = "0.85";
		let otherLinesOpacityHover = "0.1";
		let lineStroke = "2px";
		let lineStrokeHover = "2.5px";

		let circleOpacity = '0.85';
		let circleOpacityOnLineHover = "0.25"
		let circleRadius = 2;
		let circleRadiusHover = 4;

		/* Format Data */
		// let parseDate = d3.timeParse("%y-%m");
		// let formatDateIntoYearMonth = d3.timeFormat('%y-%m');

		let data = chooseData.map(function(item) {
			let proditem = {};
			proditem.name = item.name;
			let inValues = item.values.map(function(iitem) {
				let valueItem = {};
				// valueItem.ym = parseDate(iitem.ym);
				valueItem.ym = iitem.ym;
				// valueItem.unit = iitem.unit;
				// valueItem.value = iitem.value;
				valueItem.value = (Number(iitem.value) * 100).toFixed(0) - 0;
				return valueItem;
			})
			proditem.values = inValues;

			return proditem;
		})
		// TODO 这个地方后续会有bug隐患，因为只是取出数组中的第一个，如果第一个的长度小于第二个 那么会造成丢失，重构时修改整个折线图
		let xDatas = chooseData.map(elem => {
			return elem.values.map(vals => vals.ym)
		})[0];
		// console.log(xDatas);
		/* Scale */
		let xScale = d3.scalePoint().rangeRound([0, width])
		// let xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
		xScale.domain(xDatas);
		// d3.scaleTime()
		// 	.domain(d3.extent(data[0].values, d => d.ym))
		// 	.range([0, width - margin]);
		let yMax = 0,
			yMin = 0;
		for (let i = 0, len = data.length; i < len; i++) {
			let max = d3.max(data[i].values, d => d.value);
			let min = d3.min(data[i].values, d => d.value);
			if (max > yMax) {
				yMax = max
			}
			if (min < yMin) {
				yMin = min
			}
		}

		let yScale = d3.scaleLinear()
			.domain([yMin, yMax + yMax / 3])
			.range([height - margin, 0])

		let color = d3.scaleOrdinal(d3.schemeCategory10);
		/* Add SVG */
		svg.attr("width", "100%")
			.attr("height", 380)
			.attr('preserveAspectRatio', 'none')
			.attr('viewBox', '-40 -10 950 380')
			.append('g');

		function make_y_gridlines() {
			return d3.axisLeft(yScale)
				.ticks(7)
		}

		// svg.append("text")
		// 	.text(title)
		// 	.attr("class", "title")
		// 	.attr("transform", "translate(-30,13)")
		// 	.attr("text-anchor", "start")

		svg.append("g")
			.attr("class", "grid")
			.attr("transform", "translate(0,0)")
			.call(make_y_gridlines()
				.tickSize(-width)
				.tickFormat((d) => d + "%")
			);
		/* Add line into SVG */
		let line = d3.line()
			.x(d => xScale(d.ym))
			.y(d => yScale(d.value));

		let lines = svg.append('g')
			.attr('class', 'lines')
			.attr("transform", "translate(0,0)");
		lines.selectAll('.line-group')
			.data(data).enter()
			.append('g')
			.attr('class', 'line-group')
			.on("mouseover", function(d, i) {
				svg.append("text")
					.attr("class", "title-text")
					.style("fill", color(i))
					.text(d.name)
					.attr("text-anchor", "middle")
					.attr("x", (width - margin) / 2)
					.attr("y", 0);
			})
			.on("mouseout", function() {
				svg.select(".title-text").remove();
			})
			.append('path')
			.attr('class', 'line')
			.attr('d', d => line(d.values))
			.style('stroke', (d, i) => color(i))
			.style('opacity', lineOpacity)
			.on("mouseover", function() {
				d3.selectAll('.much-lines .line')
					.style('opacity', otherLinesOpacityHover);
				d3.selectAll('.much-lines .circle')
					.style('opacity', circleOpacityOnLineHover);
				d3.select(this)
					.style('opacity', lineOpacityHover)
					.style("stroke-width", lineStrokeHover)
					.style("cursor", "pointer");
			})
			.on("mouseout", function() {
				d3.selectAll(".much-lines .line")
					.style('opacity', lineOpacity);
				d3.selectAll('.much-lines .circle')
					.style('opacity', circleOpacity);
				d3.select(this)
					.style("stroke-width", lineStroke)
					.style("cursor", "none");
			});

		/* Add circles in the line */
		lines.selectAll("circle-group")
			.data(data).enter()
			.append("g")
			.style("fill", (d, i) => color(i))
			.selectAll("circle")
			.data(d => d.values).enter()
			.append("g")
			.attr("class", "circle")
			.on("mouseover", function(d) {
				d3.select(this)
					.style("cursor", "pointer")
					.append("text")
					.attr("class", "text")
					.text(`${d.value}`)
					.attr("x", d => xScale(d.ym) + 5)
					.attr("y", d => yScale(d.value) - 10);
			})
			.on("mouseout", function() {
				d3.select(this)
					.style("cursor", "none")
					// .transition()
					// .duration(duration)
					.selectAll(".text").remove();
			})
			.append("circle")
			.attr("cx", d => xScale(d.ym))
			.attr("cy", d => yScale(d.value))
			.attr("r", circleRadius)
			.style('opacity', circleOpacity)
			.on("mouseover", function() {
				d3.select(this)
					// .transition()
					// .duration(duration)
					.attr("r", circleRadiusHover);
			})
			.on("mouseout", function() {
				d3.select(this)
					// .transition()
					// .duration(duration)
					.attr("r", circleRadius);
			});

		/* Add Axis into SVG */
		let xAxis = d3.axisBottom(xScale) //.ticks(12).tickFormat(formatDateIntoYearMonth);
		let yAxis = d3.axisLeft(yScale).ticks(7);

		svg.append("g")
			.attr("class", "x axis")
			// .attr("transform", `translate(0, ${height-margin})`)
			.attr("transform", `translate(0, ${height-margin})`)
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(0,0)")
			.call(yAxis)
			.append('text')
			.attr("y", 15)
			.attr("transform", "rotate(-90)")
			// .attr("transform", "translate(0,20)")
			.attr("fill", "#000")
			.text("");
		//绘制图例区域
		let legendContainer = svgContainer.append('div').attr('class', 'legendContainer');
		let legendArea = legendContainer.append("svg")
			// .attr('width', 90)
			.attr('width', 100 * data.length)
			.attr('height', 20)

		//绑定数据，设置每个图例的位置
		// let legend = legendArea.selectAll("g")
		// 	.data(data)
		// 	.enter()
		// 	.append("g")
		// 	.attr("transform", function(d, i) {
		// 		return "translate(0," + i * 30 + ")";
		// 	});
		let legend = legendArea.selectAll("g")
			.data(data)
			.enter()
			.append("g")
			.attr("transform", function(d, i) {
				return "translate(" + (i * 100) + ",0)";
			});
		//添加图例的矩形色块
		// legend.append("rect")
		// 	.attr("x", 10)
		// 	.attr("y", 5)
		// 	.attr('width', 10)
		// 	.attr('height', 10)
		// 	.style("fill", function(d, i) {
		// 		return color(i);
		// 	});
		legend.append("line")
			.attr("x1", 0)
			.attr("x2", 10)
			.attr("y1", 10)
			.attr("y2", 10)
			.attr("stroke", function(d, i) {
				return color(i);
			})
			.attr("stroke-width", '3')

			.attr("fill", function(d, i) {
				return color(i);
			});
		//添加图例文字
		legend.append("text")
			.attr("x", 24)
			.attr("y", 9)
			.attr('class', 'legend-text')
			.style("fill", '#485465')
			.style('font-size', '12px')
			.attr("dy", ".35em")
			.text(function(d) {
				return d.name;
			});
	}

});