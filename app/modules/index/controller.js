import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject } from '@ember/service';

export default Controller.extend({
	i18n: inject(),
	cookies: inject(),
	email: null,
	password: null,
	userEmail: '',
	userPassword: '',
	emailHint: computed('userEmail', function () {
		let email = this.get('userEmail');

		if (email === '') {
			return { text: '', status: false };
		} else if (email.indexOf('@') < 0 || email.indexOf('.com') < 0) {
			return { text: '*邮箱格式错误 ', status: false };
		}
		return { text: '', status: true };

	}),
	pwHint: computed('userPassword', function () {
		let pw = this.get('userPassword');

		switch (true) {
		case pw.length === 0:
			return { text: '', status: false };

		case pw.length < 6 || pw.length > 18:
			return { text: '*登录密码需为6～18位.', status: false };

		default:
			return { text: '', status: true };
		}
	}),

	shouldDisabled: computed('emailHint', 'pwHint', function () {
		let status = [this.get('emailHint').status, this.get('pwHint').status],
			allIsOk = '';

		allIsOk = status.every((item) => {
			return item === true;
		});
		return !allIsOk;
	}),
	actions: {
		submit() {
			let PublicKey = this.get('publicKey'),
				RSA = this.get('pmController').get('RSA'),
				req = this.store.createRecord('request', { id: '0', res: 'user' }),
				privatePw = '',
				eqValues = [],
				conditions = {};

			RSA.setPublicKey(PublicKey);
			// privatePw = RSA.encrypt(this.get('login.password'));
			privatePw = RSA.encrypt(this.get('userPassword'));

			eqValues = [
				// { id: '1', type: 'eqcond', key: 'email', val: this.get('login.email') },
				{ id: '1', type: 'eqcond', key: 'email', val: this.get('userEmail') },
				{ id: '2', type: 'eqcond', key: 'password', val: privatePw },
				{ id: '3', type: 'eqcond', key: 'login_source', val: 'APM' }
			];
			eqValues.forEach((elem) => {
				req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
					id: elem.id,
					key: elem.key,
					val: elem.val,
				}))
			});
			conditions = this.store.object2JsonApi(req);

			this.get('pmController').get('Store').queryObject('/api/v1/login/0', 'auth', conditions)
				.then(data => {
					this.get('cookies').write('token', data.get('token'), { path: '/', maxAge: data.token_expire });
					localStorage.setItem('userName', data.get('user.user_name'))
					localStorage.setItem('userPhone', data.get('user.user_phone'))
					localStorage.setItem('userEmail', data.get('user.email'))
					localStorage.setItem('userImage', data.get('user.image'))
					let previousTransition = this.get('previousTransition');
					if (previousTransition) {
						this.set('previousTransition', null);
						this.get('applicationController').set('userName', localStorage.getItem('userName'));
						// previousTransition.retry();
						this.transitionToRoute('project-sort');

					} else {
						this.transitionToRoute('project-sort');
					}
				})
				.catch(error => {
					let content = '',
					hint = {};
					error.errors.forEach(ele => {
						content += ele.detail + '</br>'
					});
					hint = {
						hintModal: true,
						hintImg: true,
						title: '提示',
						content: content,
						hintBtn: false,
					}
					this.set('hint', hint);
					this.set('errors', error);
				});
		}
	}
});
