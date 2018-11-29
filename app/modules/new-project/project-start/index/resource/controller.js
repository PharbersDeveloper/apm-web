import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { set } from '@ember/object';
import rsvp from 'rsvp';
import { verificationInput } from '../../../../phtool/tool';

export default Controller.extend({
	init() {
		this._super(...arguments);
		this.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
		this.set('region', this.get('pmController').get('Store').peekAll('region'));
		this.set('history', JSON.parse(localStorage.getItem('history')));
	},
	newRegionData: computed('regionResort', function () {
		let regionResort = JSON.parse(localStorage.getItem('regionResort'));
		regionResort.sort((a, b) => {
			return a.id - b.id;
		})
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
	// totalScore: computed('race.@each.score', function () {
	// 	let race = this.get('race');
	// 	let totalScore = 0;
	// 	race.forEach((item) => {
	// 		if (item.get('score') > 100 || item.get('score') < 0 || isNaN(item.get('score'))) {

	// 			set(item, 'score', '');
	// 		}
	// 		totalScore += parseInt(item.get('score') - 0) || 0;
	// 	});
	// 	return {
	// 		value: totalScore,
	// 		overHundred: totalScore > 100 ? true : false
	// 	}
	// }),
	coVisit: computed('region.@each.covisit', function () {
		let region = this.get('region');
		let totalCovisit = 0;
		let verificationCovisit = false;

		region.forEach((item) => {
			verificationCovisit = verificationInput(item.get('covisit'), true);
			if (verificationCovisit) {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '请输入正整数.若不分配,请输入0.',
					hintBtn: false,
				}
				this.set('hint', hint);
				set(item, 'covisit', '');

			}
			totalCovisit += parseInt(item.get('covisit') - 0) || 0;
		});
		return {
			value: totalCovisit,
			overHundred: totalCovisit > 100 ? true : false
		}
	}),
	nationMeeting: computed('region.@each.nationMeeting', function () {
		let region = this.get('region');
		let nationMeeting = 0;
		let verificationNMeeting = false;

		region.forEach((item) => {
			verificationNMeeting = verificationInput(item.get('nationMeeting'), true);
			// if (item.get('nationMeeting') > 100 || item.get('nationMeeting') < 0 || isNaN(item.get('nationMeeting'))) {
			if (verificationNMeeting) {

				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '请输入正整数.若不分配,请输入0.',
					hintBtn: false,
				}
				this.set('hint', hint);
				set(item, 'nationMeeting', '');
			}
			nationMeeting += parseInt(item.get('nationMeeting') - 0) || 0;
		});
		// return nationMeeting;
		return {
			value: nationMeeting,
			overHundred: nationMeeting > 100 ? true : false
		}
	}),
	cityMeeting: computed('region.@each.cityMeeting', function () {
		let region = this.get('region');
		let cityMeeting = 0;
		let verificationCMeeting = false;
		let total = this.get('totalCityMeeting');
		region.forEach((item) => {
			verificationCMeeting = verificationInput(item.get('cityMeeting'), true);

			// if (item.get('cityMeeting') > 100 || item.get('cityMeeting') < 0 || isNaN(item.get('cityMeeting'))) {
			if (verificationCMeeting) {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '请输入正整数.若不分配,请输入0.',
					hintBtn: false,
				}
				this.set('hint', hint);
				set(item, 'cityMeeting', '');
			}
			cityMeeting += parseInt(item.get('cityMeeting') - 0) || 0;
		})
		// return cityMeeting;
		return {
			value: cityMeeting,
			overHundred: cityMeeting > 100 ? true : false
		}
	}),
	departmentMeeting: computed('region.@each.departmentMeeting', function () {
		let region = this.get('region');
		let departmentMeeting = 0;
		let verificationDMeeting = false;

		region.forEach((item) => {
			verificationDMeeting = verificationInput(item.get('departmentMeeting'), true);

			// if (item.get('departmentMeeting') > 100 || item.get('departmentMeeting') < 0 || isNaN(item.get('departmentMeeting'))) {
			if (verificationDMeeting) {

				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '请输入正整数.若不分配,请输入0.',
					hintBtn: false,
				}
				this.set('hint', hint);
				set(item, 'departmentMeeting', '');
			}
			departmentMeeting += parseInt(item.get('departmentMeeting') - 0) || 0;
		})

		// this.get('logger').log(departmentMeeting);
		return {
			value: departmentMeeting,
			overHundred: departmentMeeting > 100 ? true : false
		}
	}),
	actions: {
		saveToLocalStorage() {
			let region = this.get('pmController').get('Store').peekAll('region');
			let singleRegionJsonApi = null;
			let regionLocalStorage = region.map((item) => {
				singleRegionJsonApi = this.get('pmController').get('Store').object2JsonApi(item, false);
				return singleRegionJsonApi
			});
			// let regionJsonApi = this.get('pmController').get('Store').object2JsonApi('region', region, false);
			localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage));
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
		nextStep() {
			let wrongRegionName = '';
			let region = this.get('region');
			let iscoVisitEmpty = region.every((item) => {
				let total = '';
				total = item.get('covisit') + item.get('nationMeeting') + item.get('cityMeeting') + item.get('departmentMeeting');

				if (isNaN(total)) {
					wrongRegionName = item.get('name');
				}

				return String(item.get('covisit')).length > 0 && String(item.get('nationMeeting')).length > 0 &&
					String(item.get('cityMeeting')).length > 0 && String(item.get('departmentMeeting')).length > 0 && !isNaN(total);
			});

			this.set('iscoVisitEmpty', iscoVisitEmpty);
			if (iscoVisitEmpty) {
				let [_totalCoVisit, _totalNationMeeting, _totalCityMeeting, _totalDepartMeeting] =
					[this.get('coVisit').value, this.get('nationMeeting').value, this.get('cityMeeting').value, this.get('departmentMeeting').value];
				if (_totalCoVisit > 100 || _totalNationMeeting > 100 ||
					_totalCityMeeting > 100 || _totalDepartMeeting > 100) {
					let hint = {
						hintModal: true,
						hintImg: true,
						title: '提示',
						content: '当前输入的总值超出了100%,请检查后重新填写.',
						hintBtn: false,
					}
					this.set('hint', hint);
					this.set('iscoVisitEmpty', false);
				} else {
					let hint = {
						hintModal: true,
						hintImg: true,
						title: '提示',
						content: '确认进入下一步后,将不可修改当前内容.',
						hintBtn: true,
					}
					this.set('hint', hint);
				}
			} else {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '请填写全部的预测数据,并保证数据为正整数.',
					hintBtn: false,
				}
				this.set('hint', hint);
			}
		},
		toActionPlan() {

			let region = this.get('region');
			let params = this.get('params');
			let promiseArray = region.map((reg) => {
				let req = this.get('pmController').get('Store').createRecord('request', {
					id: reg.id + 'toAction0',
					res: 'paperinput',
				});
				let eqValues = [
					{ id: reg.id + 'toAction1', key: 'paper_id', type: 'eqcond', val: params.paperid },
					{ id: reg.id + 'toAction2', key: 'region_id', type: 'eqcond', val: reg.get('id') },
					{ id: reg.id + 'toAction3', key: 'field_work_days', type: 'upcond', val: parseInt(reg.get('covisit')) },
					{ id: reg.id + 'toAction4', key: 'national_meeting', type: 'upcond', val: parseInt(reg.get('nationMeeting')) },
					{ id: reg.id + 'toAction5', key: 'city_meeting', type: 'upcond', val: parseInt(reg.get('cityMeeting')) },
					{ id: reg.id + 'toAction6', key: 'depart_meeting', type: 'upcond', val: parseInt(reg.get('departmentMeeting')) },
				];
				eqValues.forEach((item) => {
					req.get(item.type).pushObject(this.get('pmController').get('Store').createRecord(item.type, {
						id: item.id,
						key: item.key,
						val: item.val,
					}))
				});
				let jsonReq = this.get('pmController').get('Store').object2JsonApi(req);
				return this.get('pmController').get('Store').transaction('/api/v1/answer/0', 'region', jsonReq)
			});

			rsvp.Promise.all(promiseArray).then((res) => {
				let hint = {
					hintModal: false,
					hintImg: true,
					title: '提示',
					content: '确认进入下一步后，将不可修改当前内容。',
					hintBtn: true,
				}
				this.set('hint', hint);
				this.transitionToRoute('new-project.project-start.index.action-plan');
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
		}
	}
});
