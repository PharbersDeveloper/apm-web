import DS from 'ember-data';

export default DS.Model.extend({
    course_id: DS.attr('string'),
    region_id: DS.attr('string'),
    radar_id: DS.attr('string'),
    radarfigure: DS.belongsTo('radarfigure', { async: false })
});
