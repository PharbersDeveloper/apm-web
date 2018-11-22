import DS from 'ember-data';

export default DS.Model.extend({
    course_id: DS.attr('string'),
    region_id: DS.attr('string'),
    ym: DS.attr('string'),
    rep_behavior_id: DS.attr('string'), 
    repbehaviorreport: DS.belongsTo('repbehaviorreport', { async: false }),
});
