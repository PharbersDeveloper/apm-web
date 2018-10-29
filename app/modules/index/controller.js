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
			let PublicKey = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALnqzgYjJxtX0UBt6rZ1jT3hPh4M7rX7nx5ODvGd//s7C6Vo23OCWW0K13gmKnBkOEt6A2r+Oski17tDllZuC0ECAwEAAQ==`;

			let RSA = this.get('pmController').get('RSA');
			RSA.setPublicKey(PublicKey);
			let req = this.store.createRecord('request', { id: '0', res: 'user' });
			this.get('logger').log(this.login.password);
			let privatePw = RSA.encrypt(this.login.password);
			this.get('logger').log(privatePw);
			let eqValues = [
				{ id: '1', type: 'eqcond', key: 'email', val: this.login.email },
				{ id: '2', type: 'eqcond', key: 'password', val: privatePw },
				{ id: '3', type: 'eqcond', key: 'login_source', val: 'APM' }
			]

			eqValues.forEach((elem) => {
				req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
					id: elem.id,
					key: elem.key,
					val: elem.val,
				}))
			});
			let conditions = this.store.object2JsonApi(req);
			this.get('logger').log(conditions);
			this.get('pmController').get('Store').queryObject('/api/v1/login/0', 'auth', conditions).then(data => {
				this.get('cookies').write('token', data.token, { path: '/', maxAge: data.token_expire });
				localStorage.setItem('userName', data.user.get('user_name'))
				localStorage.setItem('userPhone', data.user.get('user_phone'))
				localStorage.setItem('userEmail', data.user.get('email'))
				localStorage.setItem('userImage', data.user.get('image'))
				this.transitionToRoute('project-sort')
			});

		}
	}
});