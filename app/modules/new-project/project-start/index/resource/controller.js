import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { set } from '@ember/object';

export default Controller.extend({
	init() {
		this._super(...arguments);
		this.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
		this.set('region', this.store.peekAll('region'));
		this.set('totalcoVisit', 20);
		this.set('totalNationMeeting', 20);
		this.set('totalCityMeeting', 20);
		this.set('totalDepartMeeting', 20);

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

	coVisit: computed('region.@each.covisit', function() {
		let region = this.get('region');
		let covisit = 0;
		region.forEach((item) => {
			if (item.covisit > 100) {
				this.set('tipsModal', true);
				this.set('tipsTitle', '提示');
				this.set('tipsContent', '单个协访天数数据不能超过100%');
				set(item, 'covisit', '');
			}
			covisit += parseInt(item.covisit);
		})
		return covisit;
	}),
	nationMeeting: computed('region.@each.nationMeeting', function() {
		let region = this.get('region');
		let nationMeeting = 0;
		region.forEach((item) => {
			if (item.nationMeeting > 100) {
				this.set('tipsModal', true);
				this.set('tipsTitle', '提示');
				this.set('tipsContent', '单个全国会数据不能超过100%');
				set(item, 'nationMeeting', '');
			}
			nationMeeting += parseInt(item.nationMeeting);
		});
		return nationMeeting;
	}),
	cityMeeting: computed('region.@each.cityMeeting', function() {
		let region = this.get('region');
		let cityMeeting = 0;
		let total = this.get('totalCityMeeting');
		region.forEach((item) => {
			if (item.cityMeeting > 100) {
				this.set('tipsModal', true);
				this.set('tipsTitle', '提示');
				this.set('tipsContent', '单个城市会数据不能超过100%');
				set(item, 'cityMeeting', '');
			}
			cityMeeting += parseInt(item.cityMeeting);
		})
		return cityMeeting;
	}),
	departmentMeeting: computed('region.@each.departmentMeeting', function() {
		let region = this.get('region');
		let departmentMeeting = 0;
		region.forEach((item) => {
			if (item.departmentMeeting > 100) {
				this.set('tipsModal', true);
				this.set('tipsTitle', '提示');
				this.set('tipsContent', '单个科室会数据不能超过100%');
				set(item, 'departmentMeeting', '');
			}
			departmentMeeting += parseInt(item.departmentMeeting);
		})
		return departmentMeeting;
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
			this.set('tipsContent', region.notes);
		},
		nextStep() {
			let region = this.get('region');
			let iscoVisitEmpty = region.every((item) => {
				return item.covisit.length > 0 && item.nationMeeting.length > 0 &&
					item.cityMeeting.length > 0 && item.departmentMeeting.length > 0;
			});
			this.set('iscoVisitEmpty', iscoVisitEmpty);
			if (iscoVisitEmpty) {
				let [_totalCoVisit, _totalNationMeeting, _totalCityMeeting, _totalDepartMeeting] = [this.get('coVisit'), this.get('nationMeeting'), this.get('cityMeeting'), this.get('departmentMeeting')];
				if (_totalCoVisit > 100 || _totalNationMeeting > 100 ||
					_totalCityMeeting > 100 || _totalDepartMeeting > 100) {
					this.set('iscoVisitEmpty', false);
					this.set('tipsModal', true);
					this.set('tipsTitle', '提示');
					this.set('tipsContent', '当前输入的总值超出了100%，请检查后重新填写');
				} else {
					this.set('tipsModal', true);
					this.set('tipsTitle', '提示');
					this.set('tipsContent', '确认进入下一步后，将不可修改当前内容。');
				}
			} else {
				this.set('tipsModal', true);
				this.set('tipsTitle', '提示');
				this.set('tipsContent', '请填写全部的预测数据');
			}
		},
		toActionPlan() {
			let region = this.get('region');
			let params = this.get('params');
			let promiseArray = region.map((reg) => {
				let req = this.store.createRecord('request', {
					res: 'paperinput',
				});
				let eqValues = [
					{ key: 'paper_id', type: 'eqcond', val: params.paperid },
					{ key: 'region_id', type: 'eqcond', val: reg.id },
					{ key: 'field_work_days', type: 'upcond', val: parseInt(reg.covisit) },
					{ key: 'national_meeting', type: 'upcond', val: parseInt(reg.nationMeeting) },
					{ key: 'city_meeting', type: 'upcond', val: parseInt(reg.cityMeeting) },
					{ key: 'depart_meeting', type: 'upcond', val: parseInt(reg.departmentMeeting) },
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
				this.transitionToRoute('new-project.project-start.index.action-plan');
				// this.set('tipsModal', true);
				// this.set('tipsTitle', '提示');
				// this.set('tipsContent', '确认进入下一步后，将不可修改当前内容。');
			}).catch((error) => {
				console.error(error);
			});
			// this.transitionToRoute('new-project.project-start.index.action-plan');
		}
	}
});