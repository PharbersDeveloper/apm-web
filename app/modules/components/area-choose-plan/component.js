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
		// this.get('logger').log('in component planPaireComputed');
		let chooses = this.get('readyChoose');

		let planPaire = chooses.filterBy('isChecked', true);
		this.get('logger').log(planPaire);
		this.get('logger').log(planPaire.length);

		let _planPaire = chooses.map((ele) => {
			return ele.isChecked === true;
		});
		this.get('logger').log(_planPaire.map((item)=> item===true));
		let checkedString = "";
		let currentId = this.get('getStore').id;
		let localStorageRegion = JSON.parse(localStorage.getItem('totalRegion'));

		if (planPaire.length > 2) {
			this.get('logger').log('planPaire.length > 2');
			later(this, function() {
				set(planPaire.firstObject, 'isChecked', false);
				planPaire.forEach((item) => {
					if (item.isChecked) {
						checkedString = item.text + ',' + checkedString;
						this.get('getStore').set('actionplan', checkedString);
						let region = this.get('getStore').store.peekAll('region');
						let singleRegionJsonApi = null;
						let regionLocalStorage = region.map((item) => {
							// singleRegionJsonApi = '';
							singleRegionJsonApi = this.get('getStore').store.object2JsonApi(item, false);
							return singleRegionJsonApi
						});
						localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage))
					}
				})
			}, 100);
		} else if (planPaire.length === 1 || planPaire.length === 2) {
			this.get('logger').log('planPaire.length  ===1 || 2');
			planPaire.forEach((item) => {
					checkedString = item.text + ',' + checkedString;
					this.get('getStore').set('actionplan', checkedString);
					let region = this.get('getStore').store.peekAll('region');
					let singleRegionJsonApi = null;
					let regionLocalStorage = region.map((item) => {
						// singleRegionJsonApi = '';
						singleRegionJsonApi = this.get('getStore').store.object2JsonApi(item, false);
						return singleRegionJsonApi
					});
					localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage))
			})
		} else {
			this.get('logger').log('planPaire.length === 0');
			this.get('getStore').set('actionplan', '');
			let region = this.get('getStore').store.peekAll('region');
			let singleRegionJsonApi = null;
			let regionLocalStorage = region.map((item) => {
				singleRegionJsonApi = this.get('getStore').store.object2JsonApi(item, false);
				return singleRegionJsonApi
			});
			localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage))
		}
		return chooses;
	}),
});
