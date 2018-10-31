import Controller from '@ember/controller';
import { computed } from '@ember/object';
import SignupLogic from '../../mixins/signup-logic';

export default Controller.extend(SignupLogic, {
	init() {
		this._super(...arguments);
		this.get('pmController').get('BusinessLogic').funcInjection(this.signUpSuccess)

	},
	errorText: '',
	userName: '',
	userEmail: '',
	userPassword: '',
	nameHint: computed('userName', function() {
		let name = this.get('userName');
		if (name.length == 0 || name.length > 8) {
			return { text: '最多八字符', status: false }
		} else {
			return { text: '姓名验证成功', status: true }
		}
	}),
	emailHint: computed('userEmail', function() {
		let email = this.get('userEmail');
		if (email.indexOf('@') < 0 || email.indexOf('.com') < 0) {
			return { text: '请输入正确的邮箱格式', status: false };
		} else {
			return { text: '邮箱验证成功', status: true };
		}
	}),
	pwHint: computed('userPassword', function() {
		let pw = this.get('userPassword');
		if (pw.length < 8 || pw.length > 20) {
			return { text: '密码长度应在8～20个字符之间', status: false };
		} else {
			return { text: '密码验证成功', status: true };
		}
	}),
	actions: {
        toLogin(){
            this.transitionToRoute('index');
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
				let conditions = this.get('pmController').get('Store').object2JsonApi(req,false);
                this.get('pmController').get('Store').removeModelByID('user','sign0');

				this.get('pmController').get('Store').queryObject('/api/v1/userRegister/0', 'user', conditions)
					.then(data => {
                        let hint = {
            				hintModal: true,
            				hintImg: true,
            				title: '提示',
            				content: '注册成功,点击确认进入登陆界面.',
            				hintBtn: true,
            			}
            			this.set('hint', hint);
						// this.transitionToRoute('index');

					})
					.catch((error) => {
                        let hint = {
            				hintModal: true,
            				hintImg: true,
            				title: '提示',
            				content: '注册失败。',
            				hintBtn: false,
            			}
            			this.set('hint', hint);

						this.set('errorText', error.detail)
					});
			}
		}
	}
});
