import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		// let localStorage.getItem('regionData');
		// console.log(regionData);
		return JSON.parse(localStorage.getItem('regionData'))
	}
});