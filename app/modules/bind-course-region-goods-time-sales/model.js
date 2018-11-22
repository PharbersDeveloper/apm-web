import DS from 'ember-data';

export default DS.Model.extend({
    course_id: DS.attr('string'),
    region_id: DS.attr('string'),
    goods_id: DS.attr('string'),
    time: DS.attr('string'),
    time_type: DS.attr('string'),
    sales: DS.belongsTo('sales', { async: false })
});
