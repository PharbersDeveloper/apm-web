import DS from 'ember-data';

export default DS.Model.extend({
    field_work_days: DS.attr('number'),
    national_meeting: DS.attr('number'),
    city_meeting: DS.attr('number'),
    depart_meeting: DS.attr('number'),
});
