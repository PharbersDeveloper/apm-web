import Controller from '@ember/controller';

export default Controller.extend({
	userName: '',
	init() {
		this._super(...arguments);
		this.set('userName', localStorage.getItem('userName'))
	},
	actions: {
		exitSystem() {
			localStorage.removeItem('userName');
			localStorage.removeItem('userImage');
			localStorage.removeItem('userEmail');
			localStorage.removeItem('userPhone');
			localStorage.removeItem('regionResort');
			localStorage.removeItem('totalRegion');

			this.transitionToRoute('index')
		}
	}
});