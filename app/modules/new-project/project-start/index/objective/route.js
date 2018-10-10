import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		let paramsController = this.modelFor('new-project.project-start');
		this.controllerFor('new-project.project-start.index.objective').set('params', paramsController);
	},
	activate(a) {
		this.controllerFor('new-project.project-start.index.objective').set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
		// this.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
	},
});