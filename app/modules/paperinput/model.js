import DS from 'ember-data';

export default DS.Model.extend({
    paper_id: DS.attr('string'),
    region_id: DS.attr('string'),
    hint: DS.attr('string'),
    sorting: DS.attr('string'),
    predicted_target: DS.attr('number'),
    field_work_days: DS.attr('number'),
    national_meeting: DS.attr('number'),
    city_meeting: DS.attr('number'),
    depart_meeting: DS.attr('number'),
    action_plans: DS.attr(),
    paperinputstep: DS.belongsTo('paperinputstep', { async: false })
});
