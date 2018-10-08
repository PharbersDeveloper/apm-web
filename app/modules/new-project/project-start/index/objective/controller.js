import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	init() {
		this._super(...arguments);
		// console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
		// this.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
		this.set('regionData', this.store.peekAll('region'));
	},

	totalForecast: computed('regionData.@each.forecast', function() {
		let total = 0;
		let region = this.store.peekAll('region')
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
				if (item.selected.id === ele.id) {
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
			let isForecastEmpty = region.every((item) => {
				return item.forecast.length > 0
			});
			if (isForecastEmpty) {
				this.transitionToRoute('new-project.project-start.index.resource')
			} else {
				this.set('tipModal', true);
				this.set('content', '请填写全部的预测数据')
			}
		},
		openTips(region) {
			this.set('tipModal', true);
			this.set('content', region.notes)
		},
		changeArea(value) {
			alert('Are you sure to change Area?');
		}
	}
});