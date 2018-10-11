import Route from '@ember/routing/route';

export default Route.extend({

	beforeModel(transition) {
		if (!localStorage.getItem('userName')) {
			let loginController = this.controllerFor('index');
			loginController.set('previousTransition', transition);
			this.transitionTo('index');
		}
	},
});