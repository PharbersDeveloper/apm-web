import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { set } from '@ember/object';
import { verificationInput } from '../../../../phtool/tool';
import rsvp from 'rsvp';

export default Controller.extend({
	init() {
		this._super(...arguments);
		this.set('history', JSON.parse(localStorage.getItem('history')));
	},
	areaBarData: null,
	initSelectedRegionId: '',
	totalForecast: computed('regionData.@each.forecast', function () {
		let total = 0,
			region = this.get('regionData'),

			singleRegionJsonApi = null,
			regionLocalStorage = region.map((item) => {
				singleRegionJsonApi = this.get('pmController').get('Store').object2JsonApi(item, false);
				return singleRegionJsonApi
			});

		localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage));

		region.forEach((item) => {
			total += parseInt(item.get('forecast')) || 0;
		});
		return total;
	}),
	regionCotri: computed('regionData.@each.forecast', function () {
		let region = this.get('regionData'),
			total = this.get('totalForecast'),
			data = region.map((item) => {
				let contri = parseInt(item.get('forecast')) || 0;
				if (contri == 0) {
					return {
						id: item.get('id'),
						contri: '0%',
					}
				} else {
					let rate = ((contri / total) * 100).toFixed(1) + '%';
					return {
						id: item.id,
						contri: rate,
					}
				}
			});
		return data;
	}),
	newRegionData: computed('regionResort', function () {
		let regionResort = this.get('regionResort');
		regionResort.sort((a, b) => {
			return a.id - b.id;
		});
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
		verifInput(region, value) {
			let verif = verificationInput(value, false);
			if (value === '') {
				region.set('forecast', '')
			} else if (verif) {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '请填写预测数据,并保证数据为正整数或0.',
					hintBtn: false,
				}
				this.set('hint', hint);
				region.set('forecast', '')
			}
		},
		nextStep() {
			let emptyForecastRegion = "",
				region = this.get('newRegionData'),
				isForecastEmpty = null;

			isForecastEmpty = region.every((item) => {
				let verif = verificationInput(item.get('forecast'), false);
				if (item.get('forecast') === '') {
					emptyForecastRegion = item.get('name');
					return false;
				} else if (verif) {
					emptyForecastRegion = item.get('name');
					return false;
				} else {
					return true;
				}

			});
			this.set('isForecastEmpty', isForecastEmpty);

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
			let region = this.set('region', this.get('pmController').get('Store').peekAll('region')),
				params = this.get('params'),
				promiseArray = region.map((reg) => {
					let req = this.get('pmController').get('Store').createModel('request', {
						id: reg.get('id') + 'objectiveHint0',
						res: 'paperinput',
					});
					let eqValues = [
						{ id: reg.id + 'objectiveHint1', key: 'paper_id', type: 'eqcond', val: params.paperid },
						{ id: reg.id + 'objectiveHint2', key: 'region_id', type: 'eqcond', val: reg.get('id') },
						{ id: reg.id + 'objectiveHint3', key: 'predicted_target', type: 'upcond', val: Number(reg.get('forecast')) }
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
				this.transitionToRoute('new-project.project-start.index.resource')
			}).catch((error) => {
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
		},
		openTips(region) {
			let hint = {
				hintModal: true,
				hintImg: false,
				title: region.get('name'),
				content: region.get('notes'),
				hintBtn: false,
			}
			this.set('hint', hint);
		},
		changeArea(value) {
			this.set('barData', this.areaBarData.find(elem => elem.region_id === value).data)
		}
	}
});
