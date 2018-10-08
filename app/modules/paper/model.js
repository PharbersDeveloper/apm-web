import DS from 'ember-data';

export default DS.Model.extend({
    state: DS.attr('boolean'),
    start_time: DS.attr('number', { defaultValue: 0 }),
    end_time: DS.attr('number', { defaultValue: 0 }),
    course: DS.belongsTo('course', { async: false})
});
