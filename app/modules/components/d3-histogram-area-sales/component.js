import Component from '@ember/component';
import { run } from '@ember/runloop';
import d3 from 'd3';

export default Component.extend({
	classNames: ['histogram-area-sales', 'col-lg-6', 'col-md-6', 'col-sm-6', 'col-xs-12'],
	init() {
		this._super(...arguments);
		this.data = [{id: "1", name: "最差结果", value: 61 }, {id: "2", name: "上季", value: 78 }, {id: "3", name: "本季", value: 28 }, {id: "4", name: "最佳结果", value: 35 }];
	},
	didReceiveAttrs() {
		this._super(...arguments);
		run.schedule('render', this, this.drawHistogramAreaSales);
	},
	drawHistogramAreaSales() {
		let svgContainer = d3.select(this.element);
		let svg = svgContainer.append('svg')
			.attr('class', 'area-sales')
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.attr('viewBox', '0 0 600 260');
		let areaSalesData = this.get('data');
		let xAxisText = areaSalesData.map((item) => {
			return item.name;
		});
		// let yAxisValue = areaSalesData.map((item) => {
		// 	return item.value;
		// });
		// 自定义数据
		let width = 600;
		let height = 240;
		// draw  axis
		let x = d3.scaleBand()
			.rangeRound([0, width])
			.domain(xAxisText)
			.padding(.2);

		// let yMax = 0;
		// for (let i = 0, len = 4; i < len; i++) {
		// 	let max = d3.max(areaSalesData[i], d => { return d.value });
		// 	if (max > yMax) {
		// 		yMax = max
		// 	}
		// };

		let y = d3.scaleLinear()
			.rangeRound([height, 0])
			.domain([0, 100]);

		let x_axis = d3.axisBottom(x);
		let y_axis = d3.axisLeft(y).ticks(10).tickFormat(elem => "");
		svg.attr("width", "100%")
			.attr("height", 300);
		// .attr('preserveAspectRatio', 'none')
		// .attr('viewBox', '-40 -10 950 380')
		// .append('g');
		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(15,' + height + ')')
			.call(x_axis);
		svg.append('g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(15,0)')
            .call(y_axis);
            
        // yg.selectAll('text').

		// let color = d3.scaleOrdinal(['#EA919E', '#A5A8CF', '#A5A8CF', '#FBBF9E'])

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

        // 渐变开始
        var colorRange = ['#FCA0A8', '#EA919E', '#A5A8CF', '#6177B4', '#A5A8CF', '#6177B4', '#F5D561', '#FBBF9E']
        var color = d3.scaleLinear().range(colorRange).domain([0, 1, 2, 3, 4, 5, 6, 7]);
        
        var defs = svg.append("defs")
        //添加多个linearGradient
        areaSalesData.forEach((elem, index) => {
            var linearGradient = defs.append("linearGradient")
                                    .attr("id", elem.id + "-linearColor")
                                    .attr("x1", "0%")
                                    .attr("y1", "0%")
                                    .attr("x2", "0%")
                                    .attr("y2", "100%");

            linearGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", color(index * 2));
                    
            linearGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", color(index * 2 + 1 )); 
        });
        // 渐变结束

		// enter
        bar.enter().append("rect")
            .attr('transform', 'translate(15,0)')
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.name) + 37; })
			.attr("y", function(d) { return y(d.value); })
			// .attr("width", x.bandwidth())
			.attr("width", 40)
            .attr("height", function(d) { return height - y(d.value); })
            .style("fill",function(d) {return "url(#" + d.id + "-linearColor" + ")"});

        amount.enter().append("text")
            .attr('transform', 'translate(15,0)')
			.attr("class", "amount")
			.attr("x", function(d) { return x(d.name) + x.bandwidth() / 2; })
			.attr("y", function(d) { return y(d.value); })
			.attr("dy", 16)
			.text(function(d) { return d.value; });
	}
});