import DS from 'ember-data';

export default DS.Model.extend({
    paper_id: DS.attr('string'),
    region_id: DS.attr('string'),
    goods_id: DS.attr('string'),
    ym: DS.attr('string'),
    report_id: DS.attr('string'),
    apmreport: DS.belongsTo('apmreport', { async: false })
});
