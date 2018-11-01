import DS from 'ember-data';

export default DS.Model.extend({
	token: DS.attr('string'),
	token_expire: DS.attr('number'),
	user: DS.belongsTo('user', { async: false })
});