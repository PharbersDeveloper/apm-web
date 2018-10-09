import DS from 'ember-data';

export default DS.Model.extend({
	model() {
		return this.store.peekAll('region');
	}
});