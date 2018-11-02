import Route from '@ember/routing/route';
import {inject} from '@ember/service';

export default Route.extend({
    cookies: inject(),
    withLayout: false,
    beforeModel(transition) {
        // this.get('logger').log(transition);
        // let previousTransition  = this.controllerFor('index').get('previousTransition');
        // console.log(this.get('cookies').read('token'));
        // let token = this.get('cookies').read('token')
		// if (token) {
		// 	this.transitionTo('project-sort');
		// }
    },
    afterModel(model, transition) {
        console.log('in index route after model')
    },

});
