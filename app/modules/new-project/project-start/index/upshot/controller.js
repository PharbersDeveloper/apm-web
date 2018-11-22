import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
	i18n: inject(),
	cookies: inject(),
	init() {
		this._super(...arguments);
		this.set('history', JSON.parse(localStorage.getItem('history')));
		this.set('teachers', [{ name: 'teacher one', id: 'teacherone' }]);
		this.set('isCommit', false)
	},
	actions: {
		saveUpshot() {
			this.set('hint', {
				hintModal: true,
				hintImg: true,
				title: this.i18n.t('apm.newProject.upshot.tips') + "",
				content: this.i18n.t('apm.newProject.upshot.tipContent') + "",
				hintBtn: true,
			})
		},
		commitResult() {
			this.set('hintCT', {
				hintModal: true,
				hintImg: true,
				title: this.i18n.t('apm.newProject.upshot.chooseTeacherTips') + "",
				content: this.get('teachers'),
				hintBtn: true,
			})
		},
		confirmCommit() {

			let confirmTeacherId = this.get('confirmTeacherId'),
				req = {},
				conditions = {};
			this.get('logger').log(confirmTeacherId);
			if (typeof confirmTeacherId !== 'undefined') {
				req = this.get('pmController').get('Store').createModel('bind_teacher_student_time_paper', {
					id: 'commitStuResult',
					teacher_id: confirmTeacherId,
					paper_id: this.get('paperid')
				});
				conditions = this.get('pmController').get('Store').object2JsonApi(req);
				this.get('logger').log(conditions);
				this.get('pmController').get('Store').transaction('/api/v1/pushBindTeacherStudentTimePaper/0', 'bind_teacher_student_time_paper', conditions)
					.then(data => {
						this.get('logger').log(data.get('paper_id'));
						let responsePaperId = data.get('paper_id');
						if (responsePaperId === this.get('paperid')) {
							this.set('hintCT', {
								hintModal: false,
								hintImg: true,
								title: this.i18n.t('apm.newProject.upshot.chooseTeacherTips') + "",
								content: this.get('teachers'),
								hintBtn: true,
							});
							this.set('isCommit', true);
						}
					})
			}
		},
		changeTeacher(value) {
			this.set('confirmTeacherId', value);
		},
		confirmSaveUpshot() {
			let hint = {
				hintModal: false,
				hintImg: true,
				title: this.i18n.t('apm.newProject.upshot.tips') + "",
				content: this.i18n.t('apm.newProject.upshot.tipContent2') + "",
				hintBtn: true,
			}
			this.set('hint', hint);
			new Promise((resolve) => {
				localStorage.removeItem('regionResort')
				localStorage.removeItem('totalRegion')
				return resolve(true)
			}).then(() => {
				window.location = '/project-sort'
			})
		}
	}
});
