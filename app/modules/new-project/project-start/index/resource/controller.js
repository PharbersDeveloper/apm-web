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
				singleRegionJsonApi = '';
				singleRegionJsonApi = this.store.object2JsonApi('region', item, false);
				return singleRegionJsonApi
			});
			// console.log(regionLocalStorage)
			// let regionJsonApi = this.store.object2JsonApi('region', region, false);
			localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage));
		},
		openTips(region) {
			this.set('tipModal', true);
			this.set('tipsTitle', region.name);
			this.set('content', region.notes);
		},
		nextStep() {
			this.set('tipModal', true);
			this.set('content', '请填写全部的数据！');
			let region = this.set('region', this.store.peekAll('region'));
			let iscoVisitEmpty = region.every((item) => {
				return item.covisit.length > 0 && item.nationMeeting.length > 0 &&
					item.cityMeeting.length > 0 && item.departmentMeeting.length > 0;
			});
			if (iscoVisitEmpty) {
				this.transitionToRoute('new-project.project-start.index.action-plan')
			} else {
				this.set('tipModal', true);
				this.set('tipsTitle', '提示');
				this.set('content', '请填写全部的预测数据')
			}
		}
	}
});