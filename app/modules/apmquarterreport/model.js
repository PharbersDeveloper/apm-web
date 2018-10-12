import DS from 'ember-data';

export default DS.Model.extend({
    worst_sales: DS.attr('number'),
    best_sales: DS.attr('number'),
    pre_sales: DS.attr('number'),
    worst_share: DS.attr('number'),
    best_share: DS.attr('number'),
    pre_share: DS.attr('number'),
});
