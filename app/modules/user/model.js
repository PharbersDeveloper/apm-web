import DS from 'ember-data';

export default DS.Model.extend({
    user_name: DS.attr('string'),
    user_phone: DS.attr('string'),
    email: DS.attr('string')
});
