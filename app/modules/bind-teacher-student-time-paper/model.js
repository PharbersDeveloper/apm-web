import DS from 'ember-data';

export default DS.Model.extend({
	teacher_id: DS.attr('string'),
	paper_id: DS.attr('string')
});
