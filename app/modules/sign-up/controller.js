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

	emailHint: computed('userEmail', function() {
		let email = this.get('userEmail');
		if (email.indexOf('@') < 0 || email.indexOf('.com') < 0) {
			return { text: this.i18n.t('apm.sign.inputRightMail') + "", status: false };
		} else {
			return { text: "", status: true };
		}
	}),
	pwHint: computed('userPassword', function() {
		let pw = this.get('userPassword');
		switch (true) {
			case pw.length === 0:
				return { text: "", status: false };
				break;
			case pw.length < 6 || pw.length > 18:
				return { text: this.i18n.t('apm.sign.passwordLength') + "", status: false };
				break;
			default:
				return { text: '', status: true }
		}
	}),
	cpwHint: computed('confirmPassword', 'userPassword', function() {
		let pw = this.get('userPassword');
		let cpw = this.get('confirmPassword');
		switch (true) {
			case pw === '' && cpw === '':
				return { text: '', status: false };
				break;
			case pw === '' || pw !== cpw:
				return { text: '*两次输入不一致', status: false };
				break;
			default:
				return { text: '', status: true };
		}
	}),
	nameHint: computed('userName', function() {
		let userName = this.get('userName');
		let name = userName.replace(/(^s*)|(s*$)/g, "");
		switch (true) {
			case name.length === 0:
				return { text: "", status: false }
				break;
			case name.length > 8:
				return { text: this.i18n.t('apm.sign.eightLetter') + "", status: false }
				break;
			default:
				return { text: "", status: true }
		}
	}),
	phoneHint: computed('userPhone', function() {
		let userPhone = this.get('userPhone');
		let phoneTest = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
		if (userPhone === "") {
			return { text: "", status: false }
		} else if (phoneTest.test(userPhone) && userPhone !== "") {
			return { text: "", status: true }
		} else {
			return { text: "*手机格式错误", status: false }
		}
	}),
	cNameHint: computed('userCompanyName', function() {
		let userCompanyName = this.get('userCompanyName');
		if (userCompanyName.length === 0) {
			return { text: '', status: false };
		} else {
			return { text: '', status: true };
		}
	}),
	positionHint: computed('userPosition', function() {
		let userPosition = this.get('userPosition');
		if (userPosition.length === 0) {
			return { text: '', status: false };
		} else {
			return { text: '', status: true };
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
			let status = [this.get('emailHint').status, this.get('pwHint').status, this.get('cpwHint').status, ]
			let allIsOk = status.every((item) => {
				return true === item;
			});
			if (allIsOk) {
				let req = this.store.createRecord('request', {
					id: 'signupEmail',
					res: 'user'
				});
				let eqValues = [
					{ id: '1', type: 'eqcond', key: 'email', val: this.get('userEmail') },
				]
				eqValues.forEach((elem) => {
					req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
						id: elem.id,
						key: elem.key,
						val: elem.val,
					}))
				});
				// let conditions = this.store.object2JsonApi(req);
				let conditions = this.get('pmController').get('Store').object2JsonApi(req);
				// this.get('pmController').get('Store').removeModelByID('user', 'sign0');

				this.get('pmController').get('Store').queryObject('/api/v1/emailVerify/0', 'user', conditions)
					.then(data => {
						this.set('whichStep', 1);
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
					});
			}
		},
		submit() {
			let status = [this.get('nameHint').status, this.get('phoneHint').status, this.get('cNameHint').status, this.get('positionHint').status, ]
			let allIsOk = status.every((item) => {
				return true === item;
			});
			if (allIsOk) {
				let req = this.store.createRecord('user', {
					id: 'sign0',
					user_name: this.get('userName'),
					email: this.get('userEmail'),
					password: this.get('userPassword'),
					user_phone: this.get('userPhone'),
					company_name: this.get('userCompanyName'),
					position_name: this.get('userPosition')
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

				this.get('pmController').get('Store').queryObject('/api/v1/userRegister/0', 'user', conditions)
					.then(data => {
						// this.get('logger').log('success');
						this.set('whichStep', 2);
					})
					.catch((error) => {
						let content = "";
						error.errors.forEach(ele => {
							content += ele.detail + '</br>'
						});
						let hint = {
							hintModal: true,
							hintImg: true,
							title: this.i18n.t('apm.sign.tips') + "",
							content: content,
							hintBtn: false,
						}
						this.set('hint', hint);
					});
			}
		}
	}
});
