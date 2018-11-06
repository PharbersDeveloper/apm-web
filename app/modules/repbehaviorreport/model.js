import DS from 'ember-data';

export default DS.Model.extend({
    target_call_freq_val: DS.attr('number'),
    in_field_days_val: DS.attr('number'),
    call_times_val: DS.attr('number'),
    target_occupation_val: DS.attr('number'),
});
