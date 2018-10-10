import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	whichMonth: '1801',
	init() {
		this._super(...arguments);
		this.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
		this.set('regionData', this.store.peekAll('region'));
	},
	newRegionData: computed('regionResort', function() {
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
		saveToLocalStorage() {
			let region = this.store.peekAll('region');
			let singleRegionJsonApi = null;
			let regionLocalStorage = region.map((item) => {
				singleRegionJsonApi = this.store.object2JsonApi('region', item, false);
				return singleRegionJsonApi
			});
			// console.log(regionLocalStorage)
			// let regionJsonApi = this.store.object2JsonApi('region', region, false);
			localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage));
		},
		openTips(region) {
			this.set('tipsModal', true);
			this.set('tipsTitle', region.name);
			this.set('content', region.notes);
		},
		nextStep() {
			// this.set('tipsModal', true);
			// this.set('content', '请填写全部的数据！');
			let region = this.set('region', this.store.peekAll('region'));
			let params = this.get('params');
			let iscoVisitEmpty = region.every((item) => {
				return item.covisit.length > 0 && item.nationMeeting.length > 0 &&
					item.cityMeeting.length > 0 && item.departmentMeeting.length > 0;
			});
			this.set('iscoVisitEmpty', iscoVisitEmpty);
			if (iscoVisitEmpty) {
				let promiseArray = region.map((reg) => {
					let req = this.store.createRecord('request', {
						res: 'paperinput',
					});
					let eqValues = [
						{ key: 'paper_id', type: 'eqcond', val: params.paperid },
						{ key: 'region_id', type: 'eqcond', val: reg.id },
						{ key: 'field_work_days', type: 'upcond', val: Number(reg.covisit) },
						{ key: 'national_meeting', type: 'upcond', val: Number(reg.nationMeeting) },
						{ key: 'city_meeting', type: 'upcond', val: Number(reg.cityMeeting) },
						{ key: 'depart_meeting', type: 'upcond', val: Number(reg.departmentMeeting) },
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

				// this.set('tipsModal', true);
				// this.set('tipsTitle', '提示');
				// this.set('content', '确认进入下一步后，将不可修改当前内容。');
				// this.transitionToRoute('new-project.project-start.index.action-plan');
			} else {
				this.set('tipsModal', true);
				this.set('tipsTitle', '提示');
				this.set('content', '请填写全部的预测数据');
			}
		},
		toActionPlan() {
			this.transitionToRoute('new-project.project-start.index.action-plan');
		}
	}
});