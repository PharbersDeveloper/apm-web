import Component from '@ember/component';

export default Component.extend({
	init() {
		this._super(...arguments);
		this.radarData = [{
				name: '区域A',
				axes: [
					{ axis: '产品知识', value: 42 },
					{ axis: '目标拜访频次', value: 20 },
					{ axis: '拜访次数', value: 60 },
					{ axis: '实际工作天数', value: 26 },
					{ axis: '工作积极性', value: 35 },
					{ axis: '区域管理能力', value: 20 },
					{ axis: '销售能力', value: 40 }

				],
				color: '#26AF32'
			},
			{
				name: '区域平均',
				axes: [
					{ axis: '产品知识', value: 50 },
					{ axis: '目标拜访频次', value: 45 },
					{ axis: '拜访次数', value: 20 },
					{ axis: '实际工作天数', value: 20 },
					{ axis: '工作积极性', value: 25 },
					{ axis: '区域管理能力', value: 23 },
					{ axis: '销售能力', value: 44 }

				],
				color: '#762712'
			}
		];
		this.totalArea = [
			{ name: "区域A", value: 'A' },
			{ name: "区域B", value: 'B' },
			{ name: "区域C", value: 'C' },
			{ name: "区域D", value: 'D' },
			{ name: "区域E", value: 'E' },
			{ name: "区域F", value: 'F' },
			{ name: "区域G", value: 'G' },
		]
	},
	actions: {
		changeArea(value) {
			let BAreaData = [{
					name: '区域B',
					axes: [
						{ axis: '产品知识', value: 32 },
						{ axis: '目标拜访频次', value: 33 },
						{ axis: '拜访次数', value: 50 },
						{ axis: '实际工作天数', value: 46 },
						{ axis: '工作积极性', value: 55 },
						{ axis: '区域管理能力', value: 40 },
						{ axis: '销售能力', value: 32 }

					],
					color: '#ff6600'
				},
				{
					name: '区域平均',
					axes: [
						{ axis: '产品知识', value: 50 },
						{ axis: '目标拜访频次', value: 45 },
						{ axis: '拜访次数', value: 20 },
						{ axis: '实际工作天数', value: 20 },
						{ axis: '工作积极性', value: 25 },
						{ axis: '区域管理能力', value: 23 },
						{ axis: '销售能力', value: 44 }

					],
					color: '#762712'
				}
			];
			if (value === 'B') {
				this.set('radarData', BAreaData);
			}
		}
	}
});