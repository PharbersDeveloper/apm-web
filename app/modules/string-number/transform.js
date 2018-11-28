import DS from 'ember-data';

export default DS.Transform.extend({
	deserialize(serialized) {
		if (serialized === '') {
			return '';
		} else {
			return serialized - 0;
		}
	},

	serialize(deserialized) {
		return deserialized.toString();
	}
});
