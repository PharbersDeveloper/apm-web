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
	},
	computeLevelArray: computed('levelArray.[]', function() {
		return this.get('levelArray')
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
			// console.log(this.get('levelArray'))
			localStorage.setItem('regionResort', JSON.stringify(this.get('levelArray')));
		},
		remove(targetId) {
			this.get('levelArray').forEach(elem => {
				if (elem.get('id') === targetId && elem.get('selected') !== null) {
					this.get('areaArray').pushObject(elem.get('selected'));
					elem.set('selected', null);
				}
			})
		},
		openTips(currentRegion) {
			this.set('tipModal', true);
			this.set('currentRegion', currentRegion)
		}
	}
});