import DS from 'ember-data';

export default DS.Model.extend({
    potential: DS.attr('number'),
    potential_growth: DS.attr('number'),
    potential_contri: DS.attr('number'),
    sales: DS.attr('number'),
    sales_growth: DS.attr('number'),
    sales_contri: DS.attr('number'),
    contri_index: DS.attr('number'),
    share: DS.attr('number'),
    share_change: DS.attr('number'),
    company_target: DS.attr('number'),
    achieve_rate: DS.attr('number'),
});
