import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		let paramsController = this.modelFor('new-project.project-start');
		this.controllerFor('new-project.project-start.index.action-plan').set('params', paramsController);
		return this.store.peekAll('region');
	},
	actions: {

	}
});