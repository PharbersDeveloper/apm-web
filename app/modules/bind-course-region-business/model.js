import DS from 'ember-data';

export default DS.Model.extend({
    course_id: DS.attr('string'),
    region_id: DS.attr('string'),
    businessreport: DS.belongsTo('businessreport', { async: false })
});
