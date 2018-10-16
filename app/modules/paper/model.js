import DS from 'ember-data';

export default DS.Model.extend({
    state: DS.attr('boolean'),
    start_time: DS.attr('date-to-yyyy-mm-dd-hh-mm-ss'),
    end_time: DS.attr('date-to-yyyy-mm-dd-hh-mm-ss'),
    course: DS.belongsTo('course', { async: false })
});
