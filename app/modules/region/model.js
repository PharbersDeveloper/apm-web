import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	image: DS.attr('string'),
	describe: DS.attr('string'),
	notes: DS.attr('string', { defaultValue: '' }),
	forecast: DS.attr('string', { defaultValue: '' }),
	covisit: DS.attr('string', { defaultValue: '' }),
	nationMeeting: DS.attr('string', { defaultValue: '' }),
	cityMeeting: DS.attr('string', { defaultValue: '' }),
	departmentMeeting: DS.attr('string', { defaultValue: '' }),
	actionplan: DS.attr('string', { defaultValue: '' })
});
