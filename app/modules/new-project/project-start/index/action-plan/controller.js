import Controller from '@ember/controller';
import {
	computed,
	set
} from '@ember/object';

export default Controller.extend({
	collapsed: false,
	init() {
		this._super(...arguments);
		this.readyChoose = [{
				text: "产品知识培训",
				isChecked: true
			},
			{
				text: "销售技巧培训",
				isChecked: true
			},
			{
				text: "接受高级别代表辅导",
				isChecked: false
			},
			{
				text: "区域管理培训",
				isChecked: false
			},
			{
				text: "销售奖励",
				isChecked: false
			},
			{
				text: "目标设定培训",
				isChecked: false
			},
			{
				text: "职业发展规划",
				isChecked: false
			},
			{
				text: "谈话警告",
				isChecked: false
			},
			{
				text: "经理协助KOL协访",
				isChecked: false
			},
			{
				text: "回顾拜访计划",
				isChecked: false
			},
			{
				text: "加强进药准入工作",
				isChecked: false
			},
			{
				text: "对低级别代表进行辅导",
				isChecked: false
			},

		]

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

		this.set('region', this.store.peekAll('region'));

		this.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));

	},
	planPaire: computed('readyChoose.@each.isChecked', function() {
		let chooses = this.get('readyChoose');
		let planPaire = chooses.filterBy('isChecked', true);
		let dealPlan = planPaire;
		if (planPaire.length > 2) {
			let booleanChooses = chooses.map((choose) => {
				return choose.isChecked;
			});
			let index = booleanChooses.indexOf(true);
			Ember.set(chooses[index], 'isChecked', false);
			this.set('readyChoose', chooses);
			dealPlan.shift()
		};
		return dealPlan;
	}),
	resortRegionModel: computed('regionResort', function() {
		let regionResort = this.get('regionResort');
		let region = this.store.peekAll('region');
		let newRegion = regionResort.map((item) => {
			let singleRegion = null;
			region.forEach((ele) => {
				if (item.selected.data.id === ele.id) {
					singleRegion = ele;
				}
			})
			return singleRegion
		});
		return newRegion;
	}),
	actions: {
		toggle() {
			this.toggleProperty('collapsed')
		},
		changeArea(id) {
			console.log(id)
			// let BAreaData = [{
			// 		name: '区域B',
			// 		axes: [
			// 			{ axis: '产品知识', value: 32 },
			// 			{ axis: '目标拜访频次', value: 33 },
			// 			{ axis: '拜访次数', value: 50 },
			// 			{ axis: '实际工作天数', value: 46 },
			// 			{ axis: '工作积极性', value: 55 },
			// 			{ axis: '区域管理能力', value: 40 },
			// 			{ axis: '销售能力', value: 32 }
			//
			// 		],
			// 		color: '#ff6600'
			// 	},
			// 	{
			// 		name: '区域平均',
			// 		axes: [
			// 			{ axis: '产品知识', value: 50 },
			// 			{ axis: '目标拜访频次', value: 45 },
			// 			{ axis: '拜访次数', value: 20 },
			// 			{ axis: '实际工作天数', value: 20 },
			// 			{ axis: '工作积极性', value: 25 },
			// 			{ axis: '区域管理能力', value: 23 },
			// 			{ axis: '销售能力', value: 44 }
			//
			// 		],
			// 		color: '#762712'
			// 	}
			// ];
			// if (value === 'B') {
			// 	this.set('radarData', BAreaData);
			// }
		},
		nextStep() {
			let region = this.store.peekAll('region');
			let params = this.get('params');
			let isActionplanEmpty = region.every((item) => {
				return item.actionplan
			});
			this.set('isActionplanEmpty', isActionplanEmpty);
			if (isActionplanEmpty) {

				let promiseArray = region.map((reg) => {
					let req = this.store.createRecord('request', {
						res: 'paperinput',
					});
					let actionPlans = reg.actionplan.split(',').filter(item => item.length > 0);
					console.log(actionPlans);
					let eqValues = [
						{ key: 'paper_id', type: 'eqcond', val: params.paperid },
						{ key: 'region_id', type: 'eqcond', val: reg.id },
						{ key: 'action_plans', type: 'upcond', val: actionPlans },
					];
					eqValues.forEach((item) => {
						req.get(item.type).pushObject(this.store.createRecord(item.type, {
							key: item.key,
							val: item.val,
						}))
					});
					let jsonReq = this.store.object2JsonApi('request', req);
					return this.store.transaction('/api/v1/answer/0', 'region', jsonReq)
				});

				Promise.all(promiseArray).then((res) => {
					this.set('tipsModal', true);
					this.set('tipsTitle', '提示');
					this.set('tipsContent', '确认进入下一步后，将不可修改当前内容。');
				}).catch((error) => {
					console.error(error);
				});
				// this.set('tipsTitle', '提示');
				// this.set('tipsModal', true);
				// this.set('tipsContent', '确认进入下一步后，将不可修改当前内容。');
				// this.transitionToRoute('new-project.project-start.index.upshot')
			} else {
				this.set('tipsModal', true);
				this.set('tipsTitle', '提示');
				this.set('tipsContent', '选择全部的行动计划，并保证最多两项！')
			}
		},
		toUpshot() {
			this.transitionToRoute('new-project.project-start.index.upshot')
		}
	}
});