import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
	introduced: inject('introduced-service'),
	init() {
		this._super(...arguments);
		// this.set('ScenarioModel');
		// this.set('ProductModel');

		// this.set('AreaModel', {
		// 	areaData: [{
		// 		name: "区域A",
		// 		values: [{ ym: "18-01", value: 50 },
		// 			{ ym: "18-02", value: 10 },
		// 			{ ym: "18-03", value: 12 },
		// 			{ ym: "18-04", value: 11 },
		// 			{ ym: "18-05", value: 16 },
		// 			{ ym: "18-06", value: 19 },
		// 			{ ym: "18-07", value: 20 },
		// 			{ ym: "18-08", value: 40 },
		// 			{ ym: "18-09", value: 36 },
		// 			{ ym: "18-10", value: 45 },
		// 			{ ym: "18-11", value: 55 },
		// 			{ ym: "18-12", value: 31 }
		// 		]
		// 	}, {
		// 		name: "区域B",
		// 		values: [{ ym: "18-01", value: 50 },
		// 			{ ym: "18-02", value: 56 },
		// 			{ ym: "18-03", value: 26 },
		// 			{ ym: "18-04", value: 19 },
		// 			{ ym: "18-05", value: 36 },
		// 			{ ym: "18-06", value: 30 },
		// 			{ ym: "18-07", value: 27 },
		// 			{ ym: "18-08", value: 26 },
		// 			{ ym: "18-09", value: 19 },
		// 			{ ym: "18-10", value: 23 },
		// 			{ ym: "18-11", value: 16 },
		// 			{ ym: "18-12", value: 23 }
		// 		]
		// 	}, {
		// 		name: "区域C",
		// 		values: [{ ym: "18-01", value: 18 },
		// 			{ ym: "18-02", value: 26 },
		// 			{ ym: "18-03", value: 37 },
		// 			{ ym: "18-04", value: 50 },
		// 			{ ym: "18-05", value: 36 },
		// 			{ ym: "18-06", value: 51 },
		// 			{ ym: "18-07", value: 42 },
		// 			{ ym: "18-08", value: 16 },
		// 			{ ym: "18-09", value: 52 },
		// 			{ ym: "18-10", value: 36 },
		// 			{ ym: "18-11", value: 41 },
		// 			{ ym: "18-12", value: 25 }
		// 		]
		// 	}, {
		// 		name: "区域D",
		// 		values: [{ ym: "18-01", value: 35 },
		// 			{ ym: "18-02", value: 56 },
		// 			{ ym: "18-03", value: 45 },
		// 			{ ym: "18-04", value: 36 },
		// 			{ ym: "18-05", value: 15 },
		// 			{ ym: "18-06", value: 28 },
		// 			{ ym: "18-07", value: 35 },
		// 			{ ym: "18-08", value: 56 },
		// 			{ ym: "18-09", value: 27 },
		// 			{ ym: "18-10", value: 42 },
		// 			{ ym: "18-11", value: 25 },
		// 			{ ym: "18-12", value: 10 }
		// 		]
		// 	}, {
		// 		name: "区域E",
		// 		values: [{ ym: "18-01", value: 46 },
		// 			{ ym: "18-02", value: 44 },
		// 			{ ym: "18-03", value: 47 },
		// 			{ ym: "18-04", value: 62 },
		// 			{ ym: "18-05", value: 18 },
		// 			{ ym: "18-06", value: 35 },
		// 			{ ym: "18-07", value: 45 },
		// 			{ ym: "18-08", value: 19 },
		// 			{ ym: "18-09", value: 20 },
		// 			{ ym: "18-10", value: 44 },
		// 			{ ym: "18-11", value: 56 },
		// 			{ ym: "18-12", value: 42 }
		// 		]
		// 	}, {
		// 		name: "区域E",
		// 		values: [{ ym: "18-01", value: 52 },
		// 			{ ym: "18-02", value: 34 },
		// 			{ ym: "18-03", value: 41 },
		// 			{ ym: "18-04", value: 42 },
		// 			{ ym: "18-05", value: 48 },
		// 			{ ym: "18-06", value: 15 },
		// 			{ ym: "18-07", value: 35 },
		// 			{ ym: "18-08", value: 29 },
		// 			{ ym: "18-09", value: 40 },
		// 			{ ym: "18-10", value: 34 },
		// 			{ ym: "18-11", value: 26 },
		// 			{ ym: "18-12", value: 32 }
		// 		]
		// 	}],
		// 	wholeTable: "各区域份额结果-line chart",
		// 	dashboard: "dashboard",
		// 	areaInfo: {
		// 		title: '区域信息',
		// 		img: '',
		// 		des: '这是潜力较大的区域，是公司最重要的销售区域之一，附近汇集了许多大公司，尽管竞争对手是实力很强的原研厂家B，但是负责该区域的是一位非常有经验的代表，公司的产品市场份额一直保持的较好。这是潜力较大的区域，是公司最重要的销售区域之一，附近汇集了许多大公司，尽管竞争对手是实力很强的原研厂家B，但是负责该区域的是一位非常有经验的代表，公司的产品市场份额一直保持的较好。',
		// 		cards: [{
		// 			headline: "市场规模",
		// 			num: "4,383,924"
		// 		}, {
		// 			headline: "上期销售额",
		// 			num: "383,924",
		// 		}, {
		// 			headline: "上期达成率%",
		// 			num: "89%",
		// 		}, {
		// 			headline: "下期公司指标",
		// 			num: "500,000"
		// 		}, {
		// 			headline: "销售贡献率",
		// 			num: "17%"
		// 		}]
		// 	},
		// 	analyze: "有效性分析-",
		// 	action: "行动KPI",
		// 	radarData: [{
		// 			name: '区域A',
		// 			axes: [
		// 				{ axis: '产品知识', value: 42 },
		// 				{ axis: '目标拜访频次', value: 20 },
		// 				{ axis: '拜访次数', value: 60 },
		// 				{ axis: '实际工作天数', value: 26 },
		// 				{ axis: '工作积极性', value: 35 },
		// 				{ axis: '区域管理能力', value: 20 },
		// 				{ axis: '销售能力', value: 40 }

		// 			],
		// 			color: '#26AF32'
		// 		},
		// 		{
		// 			name: '区域平均',
		// 			axes: [
		// 				{ axis: '产品知识', value: 50 },
		// 				{ axis: '目标拜访频次', value: 45 },
		// 				{ axis: '拜访次数', value: 20 },
		// 				{ axis: '实际工作天数', value: 20 },
		// 				{ axis: '工作积极性', value: 25 },
		// 				{ axis: '区域管理能力', value: 23 },
		// 				{ axis: '销售能力', value: 44 }

		// 			],
		// 			color: '#762712'
		// 		}
		// 	],
		// 	totalArea: [
		// 		{ name: "区域A", value: 'A' },
		// 		{ name: "区域B", value: 'B' },
		// 		{ name: "区域C", value: 'C' },
		// 		{ name: "区域D", value: 'D' },
		// 		{ name: "区域E", value: 'E' },
		// 		{ name: "区域F", value: 'F' },
		// 		{ name: "区域G", value: 'G' },
		// 	],
		// 	report: {
		// 		title: "代表业务报告",
		// 		list: [{
		// 			headline: "title",
		// 			des: "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription"
		// 		}, {
		// 			headline: "title",
		// 			des: "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription"
		// 		}, {
		// 			headline: "title",
		// 			des: "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription"
		// 		}]
		// 	},
		// 	result: {
		// 		title: "公司产品历史销售结果"
		// 	},
		// 	represent: {
		// 		title: "负责代表",
		// 		img: '',
		// 		name: "流川枫",
		// 		feature: "男/28歲 / 研究生 / 英語專業 / 3年工作經驗 / 入職1年",
		// 		advantage: [{
		// 			adv: "客情关系"
		// 		}, {
		// 			adv: "学习能力"
		// 		}, {
		// 			adv: "幻灯演讲"
		// 		}],
		// 		disadvantage: [{
		// 			dis: "产品知识",
		// 		}, {
		// 			dis: "科室会",
		// 		}, {
		// 			dis: "专业性的拜访",
		// 		}, {
		// 			dis: "还有啥"
		// 		}],
		// 		cards: [{
		// 			headline: "产品知识",
		// 			num: "8"
		// 		}, {
		// 			headline: "区域规划管理能力",
		// 			num: "8"
		// 		}, {
		// 			headline: "销售能力",
		// 			num: "9"
		// 		}, {
		// 			headline: "工作积极性",
		// 			num: "9"
		// 		}],
		// 	}
		// });
	},
	actions: {
		close() {
			this.get('introduced').set('isSelectedName', '')
		}
	}
});