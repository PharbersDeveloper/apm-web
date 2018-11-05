import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import SignupLogic from '../../mixins/signup-logic';

export default Controller.extend(SignupLogic, {
	i18n: inject(),
	init() {
		this._super(...arguments);
		this.get('pmController').get('BusinessLogic').funcInjection(this.signUpSuccess);
		this.set('whichStep', 0);
	},
	userName: '',
	userEmail: '',
	userPassword: '',
	confirmPassword: '',
	userPhone: '',
	userCompanyName: '',
	userPosition: '',
	stepFlow: computed('whichStep', function() {
		let step = this.get('whichStep');
		switch (true) {
			case (step === 1):
				return {
					second: true,
					last: false
				};
				break;
			case (step === 2):
				return {
					second: true,
					last: true
				}
				break;
			default:
				return {
					second: false,
					last: false
				}

		}

	}),
	nameHint: computed('userName', function() {
		let userName = this.get('userName');
		let name = userName.replace(/(^s*)|(s*$)/g, "")
		if (name.length == 0 || name.length > 8) {
			return { text: this.i18n.t('apm.sign.eightLetter') + "", status: false }
		} else {
			return { text: this.i18n.t('apm.sign.nameSuccess') + "", status: true }
		}
	}),
	emailHint: computed('userEmail', function() {
		let email = this.get('userEmail');
		if (email.indexOf('@') < 0 || email.indexOf('.com') < 0) {
			return { text: this.i18n.t('apm.sign.inputRightMail') + "", status: false };
		} else {
			return { text: this.i18n.t('apm.sign.mailSuccess') + "", status: true };
		}
	}),
	pwHint: computed('userPassword', function() {
		let pw = this.get('userPassword');
		if (pw.length < 6 || pw.length > 18) {
			return { text: this.i18n.t('apm.sign.passwordLength') + "", status: false };
		} else {
			return { text: this.i18n.t('apm.sign.passwordSuccess') + "", status: true };
		}
	}),
	actions: {
		toLogin() {
			let hint = {
				hintModal: false,
				hintImg: true,
				title: '提示',
				content: '跳转中...',
				hintBtn: false,
			}
			this.set('hint', hint);
			this.set('userName', '');
			this.set('userEmail', '');
			this.set('userPassword', '');
			this.transitionToRoute('index');
		},
		nextStep() {
			this.set('whichStep', 1);
		},
		submit() {
			// this.get('pmController').get('Store').peekRecord('user', 'sign0').destroyRecord();
			let status = [this.get('nameHint').status, this.get('emailHint').status, this.get('pwHint').status, ]
			let allIsOk = status.every((item) => {
				return true === item;
			});
			if (allIsOk) {
				let req = this.store.createRecord('user', {
					id: 'sign0',
					user_name: this.get('userName'),
					email: this.get('userEmail'),
					password: this.get('userPassword')
				});
				// let eqValues = [
				// 	{ id: '1', type: 'eqcond', key: 'email', val: this.signup.email },
				// 	{ id: '2', type: 'eqcond', key: 'password', val: privatePw },
				// 	{ id: '3', type: 'eqcond', key: 'login_source', val: 'APM' }
				// ]

				// eqValues.forEach((elem) => {
				// 	req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
				// 		id: elem.id,
				// 		key: elem.key,
				// 		val: elem.val,
				// 	}))
				// });
				let conditions = this.get('pmController').get('Store').object2JsonApi(req);
				// this.get('pmController').get('Store').removeModelByID('user', 'sign0');

				this.get('pmController').get('Store').queryObject('/api/v1/userRegister/0', 'user', conditions)
					.then(data => {
						let hint = {
							hintModal: true,
							hintImg: true,
							title: this.i18n.t('apm.sign.tips') + "",
							content: this.i18n.t('apm.sign.signUpOk') + "",
							hintBtn: true,
						}
						this.set('hint', hint);
						// this.transitionToRoute('index');
					})
					.catch((error) => {
						let content = "";
						error.errors.forEach(ele => {
							content += ele.detail + '</br>'
						});
						this.get('logger').log(content);
						let hint = {
							hintModal: true,
							hintImg: true,
							title: this.i18n.t('apm.sign.tips') + "",
							content: content,
							hintBtn: false,
						}
						this.set('hint', hint);
						this.set('errors', error);
					});
			}
		}
	}
});
