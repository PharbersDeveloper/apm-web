import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
	cookies: inject(),
	// TODO 这边正确的做法是，后端提供验证token Interface 咱们取token 发送请求验证
	activate() {
		// this.get('logger').log('this is activate');
		this.controllerFor('application').set('userName',localStorage.getItem('userName'));
	},
	beforeModel(transition) {
		// debugger;
		let token = this.get('cookies').read('token');
		if (!token) {
			if (transition.targetName !== 'index') {
				let loginController = this.controllerFor('index');
				loginController.set('previousTransition', transition);
				loginController.set('applicationController',this.controllerFor('application'));
			}
			this.transitionTo('index');
		} else {
			if (transition.targetName === 'index' || transition.targetName === 'sign_up') {
				this.transitionTo('project-sort');
			}
		}
	},

});
