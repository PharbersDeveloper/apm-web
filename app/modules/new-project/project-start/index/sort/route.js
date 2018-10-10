import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		let paramsController = this.modelFor('new-project.project-start');
		this.controllerFor('new-project.project-start.index.sort').set('params', paramsController);
		return JSON.parse(localStorage.getItem('totalRegion'))
	}
});