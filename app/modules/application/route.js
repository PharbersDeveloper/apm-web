import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		let userName = localStorage.getItem('userName');
		return userName;
	}
});