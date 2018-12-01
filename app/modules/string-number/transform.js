import DS from 'ember-data';

export default DS.Transform.extend({
	deserialize(serialized) {
		if (serialized === '') {
			return '';
		} else if (serialized === -1) {
			return '';
		} else {
			return serialized;
		}
	},
	serialize(deserialized) {
		return deserialized;
	}
});
