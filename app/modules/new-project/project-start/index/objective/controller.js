import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	init() {
		this._super(...arguments);
		// this.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
		this.set('regionData', this.store.peekAll('region'));
	},

	totalForecast: computed('regionData.@each.forecast', function() {
		let total = 0;
		let region = this.store.peekAll('region');
		let singleRegionJsonApi = null;
		let regionLocalStorage = region.map((item) => {
			singleRegionJsonApi = '';
			singleRegionJsonApi = this.store.object2JsonApi('region', item, false);
			return singleRegionJsonApi
		});
		localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage));
		region.forEach((item) => {
			total += Number(item.forecast) || 0;
		});
		return total;
	}),
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
		nextStep() {
			let region = this.set('region', this.store.peekAll('region'));
			let params = this.get('params');
			let isForecastEmpty = region.every((item) => {
				return item.forecast.length > 0
			});
			this.set('isForecastEmpty', isForecastEmpty);
			if (isForecastEmpty) {
				let promiseArray = region.map((reg) => {
					let req = this.store.createRecord('request', {
						res: 'paperinput',
					});
					// console.log(Number(reg.forecast));
					let eqValues = [
						{ key: 'paper_id', type: 'eqcond', val: params.paperid },
						{ key: 'region_id', type: 'eqcond', val: reg.id },
						{ key: 'predicted_target', type: 'upcond', val: Number(reg.forecast) }
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
				// this.set('tipsContent', '确认进入下一步后，将不可修改当前内容。');
				// this.transitionToRoute('new-project.project-start.index.resource')
			} else {
				this.set('tipsModal', true);
				this.set('tipsTitle', '提示');
				this.set('tipsContent', '请填写全部的预测数据')
			}
		},
		toResource() {
			this.transitionToRoute('new-project.project-start.index.resource')
		},
		openTips(region) {
			this.set('tipsModal', true);
			this.set('tipsTitle', region.name);
			this.set('tipsContent', region.notes);
		},
		changeArea(value) {
			alert('Are you sure to change Area?');
		}
	}
});