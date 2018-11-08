import DS from 'ember-data';

export default DS.Model.extend({
    paper_id: DS.attr('string'),
    region_id: DS.attr('string'),
    goods_id: DS.attr('string'),
    time: DS.attr('string'),
    report_id: DS.attr('string'),
    apmreport: DS.belongsTo('apm-unit-report', { async: false })
});
