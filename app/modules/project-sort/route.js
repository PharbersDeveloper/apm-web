import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		let applicationController = this.controllerFor('application');

		applicationController.set('userName', localStorage.getItem('userName'))
	},
	actions: {
		startNewProject() {
			this.transitionTo('new-project');
		},
		historyProject() {
			this.transitionTo('history-project');
		}
	}
});
