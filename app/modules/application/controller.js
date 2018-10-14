import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
	cookies: inject(),
	userName: '',
	init() {
		this._super(...arguments);
		this.set('userName', localStorage.getItem('userName'))
	},
	actions: {
		exitSystem() {
            new Promise((resolve, reject) => {
                this.get('cookies').clear('token');
                localStorage.clear();
                return resolve(true)
            }).then(data => {
                console.info(123)
                window.location.reload()
            })			
		}
	}
});