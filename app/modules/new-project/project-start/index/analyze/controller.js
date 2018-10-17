import Controller from '@ember/controller';

export default Controller.extend({
	init() {
		this._super(...arguments);
		let totalRegion = JSON.parse(localStorage.getItem('totalRegion'));
		if (totalRegion) {
			totalRegion.forEach((item) => {
				this.store.pushPayload('region', item);
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
			let region = this.store.peekAll('region');

			let isNoteEmpty = region.every(function(item) {
				if (item.notes.length === 0) {
					emptyNotesRegion = item.name
				}
				return item.notes.length > 0
			});
			// this.set('isNoteEmpty', isNoteEmpty);

			if (isNoteEmpty) {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '确认进入下一步后，将不可修改当前内容。',
					hintBtn: true,
				}
				this.set('hint', hint);
				// this.set('notesEmpty', true);
				// this.set('tipsContent', '确认进入下一步后，将不可修改当前内容。');

			} else {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: emptyNotesRegion,
					content: '请填写完成 ' + emptyNotesRegion + ' 的内容！',
					hintBtn: false,
				}
				this.set('hint', hint);
				// this.set('notesEmpty', true);
				// this.set('tipsContent', '请填写完成 ' + emptyNotesRegion + ' 的内容！');
			}
		},
		toSort() {
			let region = this.store.peekAll('region');
			let params = this.get('params');

			let promiseArray = region.map((reg) => {
				let req = this.store.createRecord('request', {
					res: 'paperinput',
				});
				let eqValues = [
					{ key: 'paper_id', type: 'eqcond', val: params.paperid },
					{ key: 'region_id', type: 'eqcond', val: reg.id },
					{ key: 'hint', type: 'upcond', val: reg.notes }
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
				this.transitionToRoute('new-project.project-start.index.sort')
			}).catch((error) => {
				console.error(error);
			});
			// this.transitionToRoute('new-project.project-start.index.sort')
		},
		saveToLocalStorage() {
			let region = this.store.peekAll('region');
			let singleRegionJsonApi = null;
			let regionLocalStorage = region.map((item) => {
				singleRegionJsonApi = this.store.object2JsonApi('region', item, false);
				return singleRegionJsonApi;
			});
			localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage));
		}
	}
});