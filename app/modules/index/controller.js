import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { inject } from '@ember/service';
import loginModel from './login';

export default Controller.extend({
	cookies: inject(),
	email: null,
	password: null,
	login: computed(function() {
		return loginModel.create(
			getOwner(this).ownerInjection()
		);
	}),
	actions: {
		submit() {
			let req = this.store.createRecord('request', { res: 'user' });

			let eqValues = [
				{ type: 'eqcond', key: 'email', val: this.login.email },
				{ type: 'eqcond', key: 'password', val: this.login.password },
			]

			eqValues.forEach((elem) => {
				req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
					key: elem.key,
					val: elem.val,
				}))
			});
			let conditions = this.store.object2JsonApi('request', req);

			this.store.queryObject('/api/v1/login/0', 'auth', conditions).then(data => {
				this.get('cookies').write('token', data.token, { path: '/', maxAge: data.token_expire });
				localStorage.setItem('userName', data.user.get('user_name'))
				localStorage.setItem('userPhone', data.user.get('user_phone'))
				localStorage.setItem('userEmail', data.user.get('email'))
				localStorage.setItem('userImage', data.user.get('image'))
				this.transitionToRoute('project-sort')
			})
		}
	}
});