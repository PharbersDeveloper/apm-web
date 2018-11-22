import Controller from '@ember/controller';
import { inject } from '@ember/service';
import rsvp from 'rsvp';

export default Controller.extend({
	cookies: inject(),
	userName: '',
	init() {
		this._super(...arguments);
		this.set('userName',localStorage.getItem('userName'));
	},
	actions: {
		exitSystem() {
			new rsvp.Promise((resolve, reject) => {
				this.get('cookies').clear('token', {path: '/'});
				localStorage.clear();
				return resolve(true)
			}).then(() => {
				window.location.reload()
			})
		}
	}
});
