import DS from 'ember-data';

export default DS.Model.extend({
    form: DS.attr('string'),
    prod_category: DS.attr('string'),
    corp_name: DS.attr('string'),
    prod_name: DS.attr('string'),
    prod_image: DS.attr('string'),
    launch_time: DS.attr('number'),
    insure_type: DS.attr('string'),
    research_type: DS.attr('string'),
    ref_price: DS.attr('number'),
    unit_cost: DS.attr('number'),
    therapeutic_field: DS.attr('string'),
    prod_features: DS.attr('string'),
    target_department: DS.attr('string'),
    prod_describe: DS.attr('string'),
    compete: DS.attr('boolean')
});
