import Controller from '@ember/controller';

export default Controller.extend({
	init() {
		this._super(...arguments);
		let totalRegion = JSON.parse(localStorage.getItem('totalRegion'));
		if (totalRegion) {
			totalRegion.forEach((item) => {
				this.store.pushPayload('region', item);
			})
		}
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
			if (isNoteEmpty) {
				let promiseArray = region.map((reg) => {
					let req = this.store.createRecord('request', {
						res: 'paper_input',
					});
					let eqValues = [
						{ key: 'paper_id', type: 'eqcond', val: '5bb05f8fed925c04e5a853e2' },
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
			} else {
				this.set('notesEmpty', true);
				this.set('emptyNotesRegion', emptyNotesRegion)
			}
		},
		saveToLocalStorage() {
			let region = this.store.peekAll('region');
			let singleRegionJsonApi = null;
			let regionLocalStorage = region.map((item) => {
                // TODO 王森 这是啥意思啊？没看明白
				singleRegionJsonApi = '';
				singleRegionJsonApi = this.store.object2JsonApi('region', item, false);
				return singleRegionJsonApi
			});
			localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage));
		}
	}
});