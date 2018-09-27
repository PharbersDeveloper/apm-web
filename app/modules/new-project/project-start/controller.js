import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
	introduced: inject('introduced-service'),
	init() {
		this._super(...arguments);
		this.set('ScenarioModel', [{
			"content": [{
				"con": "您负责的区域为 ＸＸＸ地区。"
			}, {
				"con": "由于上一任地区经理大卫的离职，你接到上级指示接替他的岗位，成为ＸＸＸ地區的新一任地区经理。ＸＸＸ地区是整个大区中的核心地区之一，但是在大卫任职的这几年间，这个地区的销售表現一直低于公司的预期，於是，大区经理希望你能发挥你的特长，找到这个地区存在的销售问题与增长点，并作出适当的应对措施，为这个地区的产品销售带来增长。"
			}, {
				"con": "你所在的公司Med Pharma制药是一家着重于研发的合资型公司，你将负责的是心血管慢性病领域中的“新一代的心血管治疗药物Britx”，Britx的疗效相对于上一代的心血管药物，有更好的疗效与更低的副作用，在各项产品中具有相当高的兢争优势，是公司重点关注的几大产品线之一。目前，Britx在市场上正处于稳定上升阶段。但是，你可能即将面临以下几点挑战。"
			}, {
				"con": "1.外部环境不断变化，一系列新政策的出台带来的影响还是未知数。"
			}, {
				"con": "2.你所负责的团队中 ，代表经验、能力等等各有不同，你需要发现每位代表的问题，被给出合适的解决方案。"
			}, {
				"con": "3.XX地区，是各大公司十分看中的地区，竞争十分激烈。"
			}, {
				"con": "ＸＸＸ地区一共被划分成了6个辖区，每个辖区由一位代表负责，您需要尽快熟悉各辖区的业务情况，制定销售计划，合理地安排资源与执行必要的行动。"
			}],
		}]);
		this.set('ProductModel', {
			medcine: '药品领域介绍',
			proList: [{
				img: '',
				title: 'Britix',
				label: '公司产品',
				compete: true,
				factory: 'Med Pharma',
				sort: '原研',
				des: 'Britix是Med Pharma制药公司研发的新一代的心血管治疗药物 ，要求患者长期不间断使用；Britix对比于老一代产品与其他仿制药，它的疗效更加稳定，同时基于临床实验证明，Britix作为新一代的心血管治疗药物长期使用对于器官的损伤也相应较小；总体而言，Britix在心血管领域具有明显的优势，在整体市场上的表现正处于稳定上升期，公司也对此产品替代老一代心血管药物寄予厚望，但是Britx的定价比较高，除此之外，由于医生用药习惯尚未改变，对于新药的普及与认知度还有很大的提升空间。',
			}, {
				img: '',
				title: 'Swtiz',
				label: '竞品',
				factory: 'Swat',
				sort: '原研',
				des: 'Swat是一国际家知名的原研药公司，心血管慢性病领域中有着一个拳头产品Swtiz，是老一代的心血管药物，在以往，长期占据着心血管领域相当大的市场份额，但是，目前Swtiz 已经过了专利保护期，面对首国内首仿药“Norwa”，的冲击销售呈现下滑趋势，份额有明显的萎缩，Swat公司为缓解由于仿制药带来的市场冲击，已将Swtiz的定价有所下调；此外，最新的临床数据显示，它与另一类产品的联合使用能够有效降低患者发生某类心血管疾病的风险，同时由于上市较久，临床使用经验比较丰富，广受医生认可，Swat公司依然将此产品视为重要的核心产品，大量投入资源。',
			}, {
				img: '',
				title: 'Norwa',
				label: '竞品',
				factory: 'Nennet',
				sort: '首仿',
				des: 'Nennet是国内数一数二的仿制药公司，该公司的产品Norwa是Switiz的首仿药，刚刚通过了一致性评价，同时药品价格较低，对于长期服用者有较友好的价格优势，因此，近期表现十分强势，也对于原研药公司带来了很大的市场压力；Norwa的市场前景十分被看好，该公司预测，Norwa的销量将在未来2年内激增，抢占原研药Swtiz以往的份额，Nennet公司也在此投入了大量的资源，想借由一制性评价政策，提高Norwa的份额，',
			}, {
				img: '',
				title: 'Visas',
				label: '竞品',
				factory: '岭南制药',
				sort: '仿制药',
				des: '岭南制药是一家國內仿制药公司，其公司的产品一向以低价为其营销重点，在心血管领域的产品为Visas。该产品在某些特定地区，与一些支付能力比较低的地区，Visas的份额不算太低；但是由于其药物质量还未受大部分医生与患者的信任，它在整体市场中的份额很低。',
			}, ],
			prodData: [{
				name: "产品A",
				values: [{ ym: "201801", value: 50 },
					{ ym: "201802", value: 190 },
					{ ym: "201803", value: 180 },
					{ ym: "201804", value: 190 },
					{ ym: "201805", value: 160 },
					{ ym: "201806", value: 160 },
					{ ym: "201807", value: 120 },
					{ ym: "201808", value: 180 },
					{ ym: "201809", value: 110 },
					{ ym: "201810", value: 140 },
					{ ym: "201811", value: 55 },
					{ ym: "201812", value: 120 }
				]
			}, {
				name: "竞品A",
				values: [{ ym: "201801", value: 150 },
					{ ym: "201802", value: 160 },
					{ ym: "201803", value: 120 },
					{ ym: "201804", value: 140 },
					{ ym: "201805", value: 160 },
					{ ym: "201806", value: 30 },
					{ ym: "201807", value: 170 },
					{ ym: "201808", value: 130 },
					{ ym: "201809", value: 160 },
					{ ym: "201810", value: 130 },
					{ ym: "201811", value: 75 },
					{ ym: "201812", value: 130 }
				]
			}, {
				name: "竞品B",
				values: [{ ym: "201801", value: 250 },
					{ ym: "201802", value: 260 },
					{ ym: "201803", value: 220 },
					{ ym: "201804", value: 240 },
					{ ym: "201805", value: 260 },
					{ ym: "201806", value: 230 },
					{ ym: "201807", value: 270 },
					{ ym: "201808", value: 230 },
					{ ym: "201809", value: 260 },
					{ ym: "201810", value: 230 },
					{ ym: "201811", value: 175 },
					{ ym: "201812", value: 230 }
				]
			}],
		});

		this.set('AreaModel', {
			areaData: [{
				name: "区域A",
				values: [{ ym: "201801", value: 50 },
					{ ym: "201802", value: 10 },
					{ ym: "201803", value: 12 },
					{ ym: "201804", value: 11 },
					{ ym: "201805", value: 16 },
					{ ym: "201806", value: 19 },
					{ ym: "201807", value: 20 },
					{ ym: "201808", value: 40 },
					{ ym: "201809", value: 36 },
					{ ym: "201810", value: 45 },
					{ ym: "201811", value: 55 },
					{ ym: "201812", value: 31 }
				]
			}, {
				name: "区域B",
				values: [{ ym: "201801", value: 50 },
					{ ym: "201802", value: 56 },
					{ ym: "201803", value: 26 },
					{ ym: "201804", value: 19 },
					{ ym: "201805", value: 36 },
					{ ym: "201806", value: 30 },
					{ ym: "201807", value: 27 },
					{ ym: "201808", value: 26 },
					{ ym: "201809", value: 19 },
					{ ym: "201810", value: 23 },
					{ ym: "201811", value: 16 },
					{ ym: "201812", value: 23 }
				]
			}, {
				name: "区域C",
				values: [{ ym: "201801", value: 18 },
					{ ym: "201802", value: 26 },
					{ ym: "201803", value: 37 },
					{ ym: "201804", value: 50 },
					{ ym: "201805", value: 36 },
					{ ym: "201806", value: 51 },
					{ ym: "201807", value: 42 },
					{ ym: "201808", value: 16 },
					{ ym: "201809", value: 52 },
					{ ym: "201810", value: 36 },
					{ ym: "201811", value: 41 },
					{ ym: "201812", value: 25 }
				]
			}, {
				name: "区域D",
				values: [{ ym: "201801", value: 35 },
					{ ym: "201802", value: 56 },
					{ ym: "201803", value: 45 },
					{ ym: "201804", value: 36 },
					{ ym: "201805", value: 15 },
					{ ym: "201806", value: 28 },
					{ ym: "201807", value: 35 },
					{ ym: "201808", value: 56 },
					{ ym: "201809", value: 27 },
					{ ym: "201810", value: 42 },
					{ ym: "201811", value: 25 },
					{ ym: "201812", value: 10 }
				]
			}, {
				name: "区域E",
				values: [{ ym: "201801", value: 46 },
					{ ym: "201802", value: 44 },
					{ ym: "201803", value: 47 },
					{ ym: "201804", value: 62 },
					{ ym: "201805", value: 18 },
					{ ym: "201806", value: 35 },
					{ ym: "201807", value: 45 },
					{ ym: "201808", value: 19 },
					{ ym: "201809", value: 20 },
					{ ym: "201810", value: 44 },
					{ ym: "201811", value: 56 },
					{ ym: "201812", value: 42 }
				]
			}, {
				name: "区域E",
				values: [{ ym: "201801", value: 52 },
					{ ym: "201802", value: 34 },
					{ ym: "201803", value: 41 },
					{ ym: "201804", value: 42 },
					{ ym: "201805", value: 48 },
					{ ym: "201806", value: 15 },
					{ ym: "201807", value: 35 },
					{ ym: "201808", value: 29 },
					{ ym: "201809", value: 40 },
					{ ym: "201810", value: 34 },
					{ ym: "201811", value: 26 },
					{ ym: "201812", value: 32 }
				]
			}],
			wholeTable: "各区域份额结果-line chart",
			dashboard: "dashboard",
			areaInfo: {
				title: '区域信息',
				img: '',
				des: '这是潜力较大的区域，是公司最重要的销售区域之一，附近汇集了许多大公司，尽管竞争对手是实力很强的原研厂家B，但是负责该区域的是一位非常有经验的代表，公司的产品市场份额一直保持的较好。这是潜力较大的区域，是公司最重要的销售区域之一，附近汇集了许多大公司，尽管竞争对手是实力很强的原研厂家B，但是负责该区域的是一位非常有经验的代表，公司的产品市场份额一直保持的较好。',
				cards: [{
					headline: "市场规模",
					num: "4,383,924"
				}, {
					headline: "上期销售额",
					num: "383,924",
				}, {
					headline: "上期达成率%",
					num: "89%",
				}, {
					headline: "下期公司指标",
					num: "500,000"
				}, {
					headline: "销售贡献率",
					num: "17%"
				}]
			},
			analyze: "有效性分析-",
			action: "行动KPI",
			report: {
				title: "代表业务报告",
				list: [{
					headline: "title",
					des: "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription"
				}, {
					headline: "title",
					des: "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription"
				}, {
					headline: "title",
					des: "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription"
				}]
			},
			result: {
				title: "公司产品历史销售结果"
			},
			represent: {
				title: "负责代表",
				img: '',
				name: "流川枫",
				feature: "男/28歲 / 研究生 / 英語專業 / 3年工作經驗 / 入職1年",
				advantage: [{
					adv: "客情关系"
				}, {
					adv: "学习能力"
				}, {
					adv: "幻灯演讲"
				}],
				disadvantage: [{
					dis: "产品知识",
				}, {
					dis: "科室会",
				}, {
					dis: "专业性的拜访",
				}, {
					dis: "还有啥"
				}],
				cards: [{
					headline: "产品知识",
					num: "8"
				}, {
					headline: "区域规划管理能力",
					num: "8"
				}, {
					headline: "销售能力",
					num: "9"
				}, {
					headline: "工作积极性",
					num: "9"
				}],
			}
		});
	},
	actions: {
		close() {
			this.get('introduced').set('isSelectedName', '')
		}
	}
});