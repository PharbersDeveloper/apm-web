import Route from '@ember/routing/route';

export default Route.extend({
    // TODO 这边正确的做法是，后端提供验证token Interface 咱们取token 发送请求验证
	beforeModel(transition) {
		if (!localStorage.getItem('userName')) {
			let loginController = this.controllerFor('index');
			loginController.set('previousTransition', transition);
			this.transitionTo('index');
		}
	},
});