import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		return this.store.queryMultipleObject('/api/v1/findAllPaper/0', 'paper', {})
		// return {
		// 	data: []
		// };
	}
});