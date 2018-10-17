import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';

const leveObject = EmberObject.extend({});
export default Component.extend({
	levelArray: [
		leveObject.create({ id: "1", name: "1", selected: null }),
		leveObject.create({ id: "2", name: "2", selected: null }),
		leveObject.create({ id: "3", name: "3", selected: null }),
		leveObject.create({ id: "4", name: "4", selected: null }),
		leveObject.create({ id: "5", name: "5", selected: null }),
		leveObject.create({ id: "6", name: "6", selected: null })
	],
	areaArray: [],
	init() {
		this._super(...arguments);
		this.set('existSort', JSON.parse(localStorage.getItem('regionResort')));
	},
	computeLevelArray: computed('levelArray.[]', 'existSort.[]', function() {
		// console.log(this.get('existSort'));
		// console.log('in the component');
		let existSort = this.get('existSort');
		let areaArray = this.get('areaArray');
		if (existSort) {
			this.get('levelArray').forEach((ele) => {
				existSort.forEach((sort) => {
					if (sort.selected !== null) {
						if (ele.get('id') === sort.id) {
							ele.set('selected', sort.selected);
							areaArray.forEach((item) => {
								// console.log(item);
								// console.log(sort.selected.data.id)
								if (item.data.id == sort.selected.data.id) {
									this.get('areaArray').removeObject(item);
								}
							})

						}
					}
				})
			});
			// return this.
		}
		return this.get('levelArray');
	}),
	computeareaArray: computed('areaArray.[]', function() {

		let areaArray = this.get('areaArray');
		let levelArray = this.get('computeLevelArray')


		return areaArray;
	}),
	actions: {
		dragResult(obj, ops) {
			this.get('levelArray').forEach(elem => {
				if (elem.get('id') === ops.target.leveid) {
					if (ops.target.amount === "1" && elem.get('selected') === null) {
						elem.set('selected', obj)
						this.get('areaArray').removeObject(obj);
					}
				}
			});
			localStorage.setItem('regionResort', JSON.stringify(this.get('levelArray')));
		},
		remove(targetId) {
			this.get('levelArray').forEach(elem => {
				if (elem.get('id') === targetId && elem.get('selected') !== null) {
					this.get('areaArray').pushObject(elem.get('selected'));
					elem.set('selected', null);
				}
			});
			localStorage.setItem('regionResort', JSON.stringify(this.get('levelArray')));
		},
		openTips(currentRegion) {
			this.set('hint', {
				hintModal: true,
				hintImg: false,
				title: currentRegion.data.attributes.name,
				content: currentRegion.data.attributes.notes,
				hintBtn: false,
			})
			// this.set('tipModal', true);
			// this.set('currentRegion', currentRegion)
		}
	}
});