import DS from 'ember-data';

export default DS.Model.extend({
    call_times_val: DS.attr('number'),
    in_field_days_val: DS.attr('number'),
    motivation_val: DS.attr('number'),
    prod_knowledge_val: DS.attr('number'),
    sales_skills_val: DS.attr('number'),
    target_call_freq_val: DS.attr('number'),
    territory_manage_val: DS.attr('number')
});
