import Controller from '@ember/controller';

export default Controller.extend({
	init() {
		this._super(...arguments);
		this.set('history', JSON.parse(localStorage.getItem('history')));
		let totalRegion = JSON.parse(localStorage.getItem('totalRegion'));
		if (totalRegion) {
			totalRegion.forEach((item) => {
				this.get('pmController').get('Store').pushPayload('region', item);
			})
		};
		this.set('hint', {
			hintModal: false,
			title: '提示',
			content: '',
			hintBtn: false,
		})
	},
	actions: {
		nextStep() {
			let emptyNotesRegion = "";
			let region = this.get('pmController').get('Store').peekAll('region');

			let isNoteEmpty = region.every(function(item) {
				if (item.notes.length === 0) {
					emptyNotesRegion = item.name
				}
				return item.notes.length > 0
			});

			if (isNoteEmpty) {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '确认进入下一步后，将不可修改当前内容。',
					hintBtn: true,
				}
				this.set('hint', hint);

			} else {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: emptyNotesRegion,
					content: '请填写完成 ' + emptyNotesRegion + ' 的内容！',
					hintBtn: false,
				}
				this.set('hint', hint);
			}
		},
		toSort() {
			// let hint = {
			// 	hintModal: false,
			// 	hintImg: true,
			// 	title: '提示',
			// 	content: '确认进入下一步后，将不可修改当前内容。',
			// 	hintBtn: true,
			// }
			// this.set('hint', hint);
			let region = this.get('pmController').get('Store').peekAll('region');
			let params = this.get('params');

			let promiseArray = region.map((reg) => {
				let req = this.get('pmController').get('Store').createModel('request', {
					id: reg.id + '0',
					res: 'paperinput',
				});
				let eqValues = [
					{ id: reg.id + '1', key: 'paper_id', type: 'eqcond', val: params.paperid },
					{ id: reg.id + '2', key: 'region_id', type: 'eqcond', val: reg.id },
					{ id: reg.id + '3', key: 'hint', type: 'upcond', val: reg.notes }
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
				let hint = {
					hintModal: false,
					hintImg: true,
					title: '提示',
					content: '确认进入下一步后，将不可修改当前内容。',
					hintBtn: true,
				}
				this.set('hint', hint);
				this.transitionToRoute('new-project.project-start.index.sort')
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
		saveToLocalStorage() {
			let region = this.get('pmController').get('Store').peekAll('region');
			let singleRegionJsonApi = null;
			let regionLocalStorage = region.map((item) => {
				singleRegionJsonApi = this.get('pmController').get('Store').object2JsonApi(item, false);
				return singleRegionJsonApi;
			});
			localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage));
		}
	}
});
