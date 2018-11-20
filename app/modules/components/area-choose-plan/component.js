import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { later } from '@ember/runloop';

export default Component.extend({

	readyChoose: computed('originChoose', function() {
		let originChoose = this.get('originChoose');
		let localStorageRegion = JSON.parse(localStorage.getItem('totalRegion'));
		let existPlan = this.get('data').actionplan.split(',').filter((item) => {
			return item.length > 0;
		});
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
		this.get('readyChoose').forEach((item) => {
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
		let _toRungetStoreComputed = this.get('getStore');
		
		let planPaire = chooses.filterBy('isChecked', true);

		let checkedString = "";
		let currentId = _toRungetStoreComputed.id;
		let localStorageRegion = JSON.parse(localStorage.getItem('totalRegion'));

		if (planPaire.length > 2) {
			later(this, function() {
				set(planPaire.firstObject, 'isChecked', false);
				planPaire.forEach((item) => {
					if (item.isChecked) {
						checkedString = item.text + ',' + checkedString;
						this.get('getStore').set('actionplan', checkedString);
						let region = this.get('getStore').store.peekAll('region');
						let singleRegionJsonApi = null;
						let regionLocalStorage = region.map((item) => {
							singleRegionJsonApi = this.get('getStore').store.object2JsonApi(item, false);
							return singleRegionJsonApi
						});
						localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage))
					}
				})
			}, 100);
		} else if (planPaire.length === 1 || planPaire.length === 2) {
			planPaire.forEach((item) => {
					checkedString = item.text + ',' + checkedString;
					this.get('getStore').set('actionplan', checkedString);
					let region = this.get('getStore').store.peekAll('region');
					let singleRegionJsonApi = null;
					let regionLocalStorage = region.map((item) => {
						singleRegionJsonApi = this.get('getStore').store.object2JsonApi(item, false);
						return singleRegionJsonApi
					});
					localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage))
			})
		} else if(planPaire.length === 0){
			this.get('getStore').set('actionplan', '');
			let region = this.get('getStore').store.peekAll('region');
			let singleRegionJsonApi = null;
			let regionLocalStorage = region.map((item) => {
				singleRegionJsonApi = this.get('getStore').store.object2JsonApi(item,false);
				return singleRegionJsonApi
			});
			localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage))
		}
		return chooses;
	}),
});
