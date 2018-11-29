import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { set } from '@ember/object';
import rsvp from 'rsvp';

export default Controller.extend({
	collapsed: false,
	regionResort: [],
	init() {
		this._super(...arguments);
		this.set('areaRadars', []);
		this.set('history', JSON.parse(localStorage.getItem('history')));
		this.set('readyChoose', []);
	},
	resortRegionModel: computed('regionResort', function () {
		let regionResort = this.get('regionResort');
		regionResort.sort((a, b) => {
			return a.id - b.id
		});
		let localStorageRegion = JSON.parse(localStorage.getItem('totalRegion'));
		// debugger;
		let region = this.get('pmController').get('Store').peekAll('region');
		let newRegion = regionResort.map((item) => {
			let singleRegion = null;
			region.forEach((ele) => {
				if (item.selected.data.id === ele.get('id')) {
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
			// let region = this.get('pmController').get('Store').peekAll('region');
			let _name = '';
			let isActionplanEmpty = this.get('resortRegionModel').every((item) => {
				this.get('logger').log(item.get('actionplan'));
				this.get('logger').log(item);

				if (item.get('actionplan') === '') {
					_name = item.get('name');
				}
				return item.get('actionplan')
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
					content: '请为 ' + _name + ' 选择适当的行动计划,并保证最多两项！',
					hintBtn: false,
				}
				this.set('hint', hint);
			}
		},
		toUpshot() {

			let region = this.get('pmController').get('Store').peekAll('region');
			let params = this.get('params');
			let promiseArray = region.map((reg) => {
				let req = this.get('pmController').get('Store').createModel('request', {
					id: reg.get('id') + 'actionHint0',
					res: 'paperinput',
				});
				let actionPlans = reg.get('actionplan').split(',').filter(item => item.length > 0);
				let eqValues = [
					{ id: reg.id + 'actionHint1', key: 'paper_id', type: 'eqcond', val: params.paperid },
					{ id: reg.id + 'actionHint2', key: 'region_id', type: 'eqcond', val: reg.get('id') },
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
			rsvp.Promise.all(promiseArray).then(() => {
				let hint = {
					hintModal: false,
					hintImg: true,
					title: '提示',
					content: '确认进入下一步后，将不可修改当前内容。',
					hintBtn: true,
				}
				this.set('hint', hint);
				this.transitionToRoute('new-project.project-start.index.upshot')
			})
				.catch((error) => {
					let content = "";
					error.errors.forEach(ele => {
						content += ele.detail + '</br>'
					});
					let hint = {
						hintModal: true,
						hintImg: true,
						title: "提示",
						content: content,
						hintBtn: false,
					}
					this.set('hint', hint);
				});
		}
	}
});
