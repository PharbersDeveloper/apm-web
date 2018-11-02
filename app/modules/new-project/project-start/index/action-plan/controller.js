import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { set } from '@ember/object';

export default Controller.extend({
	collapsed: false,
	regionResort: [],
	init() {
		this._super(...arguments);
		this.set('areaRadars', []);
		this.set('history', JSON.parse(localStorage.getItem('history')));
		this.set('readyChoose', []);
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
			set(chooses[index], 'isChecked', false);
			this.set('readyChoose', chooses);
			dealPlan.shift()
		}
		return dealPlan;
	}),
	resortRegionModel: computed('regionResort', function() {
		let regionResort = this.get('regionResort');
		regionResort.sort((a, b) => {
			return a.id - b.id
		});
		let region = this.get('pmController').get('Store').peekAll('region');
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
		changeArea(value) {
			let data = this.areaRadars.find(elem => elem.region_id === value).data.toArray()
			this.set('radarData', data)
		},
		nextStep() {
			let region = this.get('pmController').get('Store').peekAll('region');
			let isActionplanEmpty = region.every((item) => {
				return item.actionplan
			});
			this.set('isActionplanEmpty', isActionplanEmpty);
			if (isActionplanEmpty) {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '确认进入下一步后,将不可修改当前内容.',
					hintBtn: true,
				}
				this.set('hint', hint);
			} else {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '选择全部的行动计划,并保证最多两项！',
					hintBtn: false,
				}
				this.set('hint', hint);
			}
		},
		toUpshot() {
			let hint = {
				hintModal: false,
				hintImg: true,
				title: '提示',
				content: '确认进入下一步后，将不可修改当前内容。',
				hintBtn: true,
			}
			this.set('hint', hint);
			let region = this.get('pmController').get('Store').peekAll('region');
			let params = this.get('params');
			let promiseArray = region.map((reg) => {
				let req = this.get('pmController').get('Store').createModel('request', {
					id: reg.id + 'actionHint0',
					res: 'paperinput',
				});
				let actionPlans = reg.actionplan.split(',').filter(item => item.length > 0);
				let eqValues = [
					{ id: reg.id + 'actionHint1', key: 'paper_id', type: 'eqcond', val: params.paperid },
					{ id: reg.id + 'actionHint2', key: 'region_id', type: 'eqcond', val: reg.id },
					{ id: reg.id + 'actionHint3', key: 'action_plans', type: 'upcond', val: actionPlans },
				];
				eqValues.forEach((item) => {
					req.get(item.type).pushObject(this.get('pmController').get('Store').createModel(item.type, {
						id: item.id,
						key: item.key,
						val: item.val,
					}))
				});
				let jsonReq = this.get('pmController').get('Store').object2JsonApi(req);
				return this.get('pmController').get('Store').transaction('/api/v1/answer/0', 'region', jsonReq)
			});
			Promise.all(promiseArray).then(() => {
					this.transitionToRoute('new-project.project-start.index.upshot')
				})
				.catch((error) => {
					this.get('logger').log(error);
				});
		}
	}
});