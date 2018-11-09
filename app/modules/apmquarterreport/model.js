import DS from 'ember-data';

export default DS.Model.extend({
    worst_unit: DS.attr('number'),
    best_unit: DS.attr('number'),
    pre_unit: DS.attr('number'),
    worst_share: DS.attr('number'),
    best_share: DS.attr('number'),
    pre_share: DS.attr('number'),
});
