import Component from '@ember/component';
import { run } from '@ember/runloop';
import d3 from 'd3';

export default Component.extend({
    tagName: 'div',
    chartId: '',
    backgroundColor: '#FFF',
    laterThreeChangeBg: false,
    title: '',

    didReceiveAttrs() {
        if (this.get('chartId') === '') {
            throw 'chartId is null or undefinde, please set value';
        } else {
            run.scheduleOnce('render', this, this.drawChart);
        }        
    },
    drawChart() {
        d3.select(`#${this.get('chartId')}`).select('svg').remove();
        let dataset = [
            { key: 'W1', value: 32, value2: 16 },
            { key: 'W2', value: 26, value2: 20 },
            { key: 'W3', value: 45, value2: 40 },
            { key: 'W4', value: 38, value2: 35 },
            { key: 'W5', value: 53, value2: 24 },
            { key: 'W6', value: 48, value2: 18 },
            { key: 'W7', value: 42, value2: 12 },
            { key: 'W8', value: 34, value2: 15 },
            { key: 'W9', value: 37, value2: 23 },
            { key: 'W10', value: 36, value2: 24 },
            { key: 'W11', value: 34, value2: 12 },
            { key: 'W12', value: 32, value2: 18 },
            { key: 'W13', value: 20, value2: 26 },
            { key: 'W14', value: 19, value2: 36 },
            { key: 'W15', value: 28, value2: 26 },
        ];

        let width = 900;
        let height = 340;
        let margin = { top: 50, right: 20, bottom: 30, left: 30 };

        let xDatas = dataset.map(elem => elem.key);
        let values = dataset.map(elem => elem.value);

        let xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            yScale = d3.scaleLinear().rangeRound([height, 0]);

        xScale.domain(xDatas);
        yScale.domain([0, d3.max(values)]);

        let svgContainer = d3.select(`#${this.get('chartId')}`);
        let tooltip = svgContainer.append('div').attr("class", "_tooltip_1mas67").style("opacity", 0.0);
        let svg = svgContainer.append("svg").style('background-color', this.get('backgroundColor'))
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('viewBox', '0 0 960 420')

        let g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        g.attr('class', '_container-g_1mas67')
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

            let chart = g.selectAll('bar')
            .data(dataset)
            .enter().append('g');

        /**
         * 渐变开始
         */
        var colorRange = ['#EFA08D', '#F0BC89', '#F0DB84', '#E5F17F', '#C0F17A', '#70F272', '#6BF297', '#61F3E9']
    
        var color = d3.scaleLinear().range(colorRange).domain([1, 2, 3, 4, 5, 6, 7, 8]);

        var defs = svg.append("defs")

        var linearGradient = defs.append("linearGradient")
                                .attr("id","linearColor")
                                .attr("x1","0%")
                                .attr("y1","0%")
                                .attr("x2","100%")
                                .attr("y2","0%");

        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color",color(1));
                
        linearGradient.append("stop")
            .attr("offset", "14.28%")
            .attr("stop-color",color(2));
        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color",color(8));

        /**
         * 渐变结束
         */
        chart.append('rect')
            .attr('height', function (d) { return height - yScale(d.value); })
            .attr('x', function (d) { return xScale(d.key); })
            .attr('y', function (d) { return yScale(d.value); })
            .attr('width', xScale.bandwidth() / 2)
            .attr('class', '_bar_1mas67')
            // .style("fill","url(#" + linearGradient.attr("id") + ")");

        chart.append('text')
            .attr('class', '_barText_1mas67')
            .attr('x', function (d) { return xScale(d.key); })
            .attr('y', function (d) { return yScale(d.value); })
            .attr('dx', xScale.bandwidth() / 4)
            .attr('dy', 20)
            .attr('text-anchor', 'middle')
            .text(function (d) { return d.value; });

        if (this.get('laterThreeChangeBg')) {
            d3.select(`#${this.get('chartId')}`)
                .selectAll('._container-g_1mas67')
                .selectAll('g:nth-last-of-type(3)')
                .select('rect')
                .attr('class', '_predict-bar_1mas67')
            d3.select(`#${this.get('chartId')}`)
                .selectAll('._container-g_1mas67')
                .selectAll('g:nth-last-of-type(2)')
                .select('rect')
                .attr('class', '_predict-bar_1mas67')
            d3.select(`#${this.get('chartId')}`)
                .selectAll('._container-g_1mas67')
                .selectAll('g:last-of-type')
                .select('rect')
                .attr('class', '_predict-bar_1mas67')
        }

        let line = d3.line()
            .x(function (d) { return xScale(d.key); })
            .y(function (d) { return yScale(d.value2); });

        // Line 
        g.append("path")
            .datum(dataset)
            .attr("fill", "none")
            .attr("stroke", "#FF8190")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("transform", "translate(" + xScale.bandwidth() / 4 + ",0)")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        chart.on('mouseover', function (d) {
            tooltip.style("opacity", 1.0);
            tooltip.html(d.key + "<br>" + "份额：" + d.value2 + "%" + "<br>" + "销售额：" + d.value)
                .style("left", (d3.event.offsetX + 20) + "px")
                .style("top", (d3.event.offsetY) + "px")

            d3.select(this).attr('opacity', 0.7);
        }).on('mouseout', function (d) {
            tooltip.style("opacity", 0.0);
            d3.select(this).attr('opacity', 1)
        });

        //绘制图例区域
		let legendContainer = svgContainer.append('div').attr('class', 'legendContainer');
		var legendArea = legendContainer.append("svg")
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('viewBox', '0 0 960 20')
            .attr("transform", function(d, i) {
				return "translate(" + 900 / 2 + ", 0)";
            });
        let legendData = ["份额", "销售额"];
        if (this.get('laterThreeChangeBg')) {
            legendData = ["份额", "销售额", "预测销售额"];
        }
            
		var legend = legendArea.selectAll("g")
			.data(legendData)
			.enter()
			.append("g")
			.attr("transform", function(d, i) {
				return "translate(" + i * 100 + ",0)";
            });

		//添加图例的矩形色块
		legend.append("rect")
			.attr("x", 10)
			.attr("y", 5)
			.attr('width', function(d, i) {
                if (d == '份额') {
                    return 20;
                }  else {
                    return 10;
                }
            })
			.attr('height', function(d, i) {
                if (d == '份额') {
                    return 5;
                }  else {
                    return 30;
                }
            })
			.style("fill", function(d, i) {
                if (d == '份额') {
                    return '#FA6F80';
                } else if (d == '销售额') {
                    return '#4A90E2';
                } else {
                    return '#F5A623';
                }
			}).attr("transform", function(d, i) {
                if (d == '份额') {
                    return "translate(0 ,5)";
                }
            });

		//添加图例文字
		legend.append("text")
			.attr("x", 40)
			.attr("y", 12)
			.style("fill", '#485465')
			.style('font-size', '12px')
			.attr("dy", ".35em")
			.text(function(d, i) {
				return d;
			});

    }
});
