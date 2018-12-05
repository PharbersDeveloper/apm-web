import Component from '@ember/component';
import { computed, set } from '@ember/object';
// import { later } from '@ember/runloop';

export default Component.extend({
	init() {
		this._super(...arguments);
		this.set('_alreadyChooseItem', []);
	},
	readyChoose: computed('originChoose', function () {
		let originChoose = this.get('originChoose');
		let localStorageRegion = JSON.parse(localStorage.getItem('totalRegion'));
		let existPlan = this.get('data').get('actionplan').split(',').filter((item) => {
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
	getStore: computed('data', 'readyChoose', function () {
		let existPlan = this.get('data').get('actionplan').split(',').filter((item) => {
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
	planPaireComputed: computed('readyChoose.@each.isChecked', function () {
		let chooses = this.get('readyChoose'),
			_temporaryChoose = this.get('_alreadyChooseItem'),
			_toRungetStoreComputed = this.get('getStore'),
			planPaire = chooses.filterBy('isChecked', true),
			checkedString = "",
			currentId = _toRungetStoreComputed.get('id'),
			localStorageRegion = JSON.parse(localStorage.getItem('totalRegion'));

		if (planPaire.length > 2) {
			/**
			 * ES6 写法求差集在IE11 上不被支持
			 * let _set = new Set(_temporaryChoose),
			 * differenceABSet = planPaire.filter(v => !_set.has(v));
			 * _temporaryChoose.pushObject(differenceABSet.get('firstObject'));
			 */

			let newDiff = planPaire.filter((item) => {
				return _temporaryChoose.indexOf(item) === -1
			});
			_temporaryChoose.pushObject(newDiff.get('firstObject'));

			// later(this, function () {
			let _id = _temporaryChoose.get('firstObject.id')
			planPaire.forEach((ele) => {
				if (_id === ele.id) {
					set(ele, 'isChecked', false);
					_temporaryChoose.removeAt(0);
				}
			})
			// set(planPaire.get('firstObject'), 'isChecked', false);
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
			// }, 100);
		} else if (planPaire.length === 1 || planPaire.length === 2) {
			if (planPaire.get('length') === 1) {
				this.set('_alreadyChooseItem', planPaire);
			} else if (planPaire.get('length') === 2) {
				if (_temporaryChoose.get('length') !== 2) {
					planPaire.forEach((item) => {
						if (item.id !== _temporaryChoose.get('firstObject.id')) {
							_temporaryChoose.pushObject(item)
						}
					})
				}
			}

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
		} else if (planPaire.length === 0) {
			this.set('_alreadyChooseItem', []);
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
