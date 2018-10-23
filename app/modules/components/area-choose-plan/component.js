import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { later } from '@ember/runloop';

export default Component.extend({

	readyChoose: computed('originChoose', function() {
		let originChoose = this.get('originChoose');
		let localStorageRegion = JSON.parse(localStorage.getItem('totalRegion'));
		return originChoose.map((item) => {
			return {
				id: item.id,
				text: item.text,
				isChecked: item.isChecked
			}
		})
	}),
	getStore: computed('data', 'readyChoose', function() {
		let existPlan = this.get('data').actionplan.split(',').filter((item) => {
			return item.length > 0;
		});
		let initChoose = this.get('readyChoose');
		initChoose.forEach((item) => {
			if (existPlan.length > 0) {
				existPlan.forEach((ele) => {
					if (item.text == ele) {
						set(item, 'isChecked', true)
					}
				})
			}
		});
		return this.get('data');
	}),
	planPaireComputed: computed('readyChoose.@each.isChecked', function() {
		let chooses = this.get('readyChoose');
		let planPaire = chooses.filterBy('isChecked', true);

		let checkedString = "";
		let currentId = this.get('getStore').id;
		let localStorageRegion = JSON.parse(localStorage.getItem('totalRegion'));

		if (planPaire.length > 2) {
			later(this, function() {
				set(planPaire.firstObject, 'isChecked', false);
				// planPaire.firstObject.set('isChecked', false)
				// planPaire.firstObject.set('text', planPaire.firstObject.get('text'))
				// console.info(planPaire);
				planPaire.forEach((item) => {
					if (item.isChecked) {
						checkedString = item.text + ',' + checkedString;
						this.get('getStore').set('actionplan', checkedString);
						let region = this.get('getStore').store.peekAll('region');
						let singleRegionJsonApi = null;
						let regionLocalStorage = region.map((item) => {
							singleRegionJsonApi = '';
							singleRegionJsonApi = this.get('getStore').store.object2JsonApi('region', item, false);
							return singleRegionJsonApi
						});
						localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage))
					}
				})
			}, 100);
		} else {
			planPaire.forEach((item) => {
				if (item.isChecked) {
					checkedString = item.text + ',' + checkedString;
					this.get('getStore').set('actionplan', checkedString);
					let region = this.get('getStore').store.peekAll('region');
					let singleRegionJsonApi = null;
					let regionLocalStorage = region.map((item) => {
						singleRegionJsonApi = '';
						singleRegionJsonApi = this.get('getStore').store.object2JsonApi('region', item, false);
						return singleRegionJsonApi
					});
					localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage))
				}
			})
		}
		return chooses;
	}),
});