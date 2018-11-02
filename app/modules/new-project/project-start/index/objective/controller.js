import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { set } from '@ember/object';

export default Controller.extend({
	init() {
		this._super(...arguments);
		this.set('history', JSON.parse(localStorage.getItem('history')));
	},
	areaBarData: null,
	initSelectedRegionId: '',
	totalForecast: computed('regionData.@each.forecast', function() {
		let total = 0;
		// let region = this.get('pmController').get('Store').peekAll('region');
		let region = this.get('regionData');

		let singleRegionJsonApi = null;
		let regionLocalStorage = region.map((item) => {
			singleRegionJsonApi = this.get('pmController').get('Store').object2JsonApi(item, false);
			return singleRegionJsonApi
		});
		localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage));

		region.forEach((item) => {
			if (isNaN(item.forecast) || item.forecast< 0) {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '请输入正整数.若不分配,请输入0.',
					hintBtn: false,
				}
				this.set('hint', hint);
				// this.set('tipsModal', true);
				// this.set('tipsTitle', '提示');
				// this.set('tipsContent', '单个协访天数数据不能超过100%');
				set(item, 'forecast', '');
			}
			total += parseInt(item.forecast) || 0;
		});
		return total;
	}),
	regionCotri: computed('regionData.@each.forecast', function() {
		// let region = this.get('pmController').get('Store').peekAll('region');
		let region = this.get('regionData');

		let total = this.get('totalForecast');

		let data = region.map((item) => {
			let contri = parseInt(item.forecast) || 0;
			if (contri == 0) {
				return {
					id: item.id,
					contri: '0%',
				}
			} else {
				let rate = ((contri / total) * 100).toFixed(2) + '%';
				return {
					id: item.id,
					contri: rate,
				}
			}
		});
		return data;
	}),
	newRegionData: computed('regionResort', function() {
		let regionResort = this.get('regionResort');
		regionResort.sort((a, b) => {
			return a.id - b.id;
		})
		// let region = this.get('pmController').get('Store').peekAll('region');
		let region = this.get('regionData');

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
			let emptyForecastRegion = "";
			// let region = this.set('region', this.get('pmController').get('Store').peekAll('region'));
			let region = this.get('regionData');
			let isForecastEmpty = region.every((item) => {
				if (item.forecast.length == 0) {
					emptyForecastRegion = item.name;
				}
				if (isNaN(Boolean(item.forecast) ? item.forecast : 0)) {
					emptyForecastRegion = item.name;
				}
				return item.forecast.length > 0 && !isNaN(Boolean(item.forecast) ? item.forecast : 0)
			});
			this.set('isForecastEmpty', isForecastEmpty);
			// this.set('tipsTitle', '提示');

			if (isForecastEmpty) {
				let totalCompanyTarget = this.get('totalCompanyTarget');
				let totalForecast = this.get('totalForecast');

				if (totalForecast < totalCompanyTarget) {
					let hint = {
						hintModal: true,
						hintImg: true,
						title: '提示',
						content: '您的预测总指标需要超过公司本季度总指标！',
						hintBtn: false,
					}
					this.set('hint', hint);
					this.set('isForecastEmpty', false);
				} else {
					let hint = {
						hintModal: true,
						hintImg: true,
						title: '提示',
						content: '确认进入下一步后，将不可修改当前内容。',
						hintBtn: true,
					}
					this.set('hint', hint);
				}
			} else {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '请填写 ' + emptyForecastRegion + ' 的预测数据，并保证为正整数。',
					hintBtn: false,
				}
				this.set('hint', hint);
			}
		},
		toResource() {
			let hint = {
				hintModal: false,
				hintImg: true,
				title: '提示',
				content: '确认进入下一步后，将不可修改当前内容。',
				hintBtn: true,
			}
			this.set('hint', hint);
			let region = this.set('region', this.get('pmController').get('Store').peekAll('region'));
			let params = this.get('params');
			let promiseArray = region.map((reg) => {
				let req = this.get('pmController').get('Store').createModel('request', {
					id: reg.id + 'objectiveHint0',
					res: 'paperinput',
				});
				let eqValues = [
					{ id: reg.id + 'objectiveHint1', key: 'paper_id', type: 'eqcond', val: params.paperid },
					{ id: reg.id + 'objectiveHint2', key: 'region_id', type: 'eqcond', val: reg.id },
					{ id: reg.id + 'objectiveHint3', key: 'predicted_target', type: 'upcond', val: parseInt(reg.forecast) }
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

			Promise.all(promiseArray).then((res) => {
				this.transitionToRoute('new-project.project-start.index.resource')
			}).catch((error) => {
				this.get('logger').log(error);
			});
		},
		openTips(region) {
			let hint = {
				hintModal: true,
				hintImg: false,
				title: region.name,
				content: region.notes,
				hintBtn: false,
			}
			this.set('hint', hint);
		},
		changeArea(value) {
			this.set('barData', this.areaBarData.find(elem => elem.region_id === value).data)
		}
	}
});
