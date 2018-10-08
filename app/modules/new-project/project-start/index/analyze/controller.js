import Controller from '@ember/controller';

export default Controller.extend({
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
				this.transitionToRoute('new-project.project-start.index.sort')
			} else {
				this.set('notesEmpty', true);
				this.set('emptyNotesRegion', emptyNotesRegion)
			}
			// console.log(isNoteEmpty);
		},
		saveToLocalStorage() {
			let region = this.store.peekAll('region');
			let singleRegionJsonApi = null;
			let regionLocalStorage = region.map((item) => {
				singleRegionJsonApi = '';
				singleRegionJsonApi = this.store.object2JsonApi('region', item, false);
				let data = {};
				data.name = singleRegionJsonApi.data.attributes.name;
				data.id = singleRegionJsonApi.data.id;
				data.describe = singleRegionJsonApi.data.attributes.describe;
				data.notes = singleRegionJsonApi.data.attributes.notes;
				data.image = singleRegionJsonApi.data.attributes.image;
				return data
			});
			// console.log(regionLocalStorage)
			// let regionJsonApi = this.store.object2JsonApi('region', region, false);
			localStorage.setItem('regionData', JSON.stringify(regionLocalStorage));
		}
	}
});