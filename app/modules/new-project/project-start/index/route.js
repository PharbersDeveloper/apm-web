import Route from '@ember/routing/route';

export default Route.extend({
    setupController(controller, model){
        this._super(...arguments);
        controller.set('history', JSON.parse(localStorage.getItem('history')));
    }
});
