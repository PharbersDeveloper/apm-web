import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
	cookies: inject(),
	actions: {
		saveUpshot() {
			console.log('saveUpshot');
			this.set('hint', {
				hintModal: true,
				hintImg: true,
				title: '提示',
				content: '本次课程中的内容将进行保存,<br/>您将可以在“历史报告”中查看本次的课程内容与结果.',
				hintBtn: true,
			})
			// this.set('tipsModal', true);
			// this.set('tipsContent', '本次课程中的内容将进行保存。<br/>您将可以在“历史报告”中查看本次的课程内容与结果。')
		},
		confirmSaveUpshot() {
			new Promise((resolve, reject) => {
				this.get('cookies').clear('token');
				localStorage.clear();
				return resolve(true)
			}).then(data => {
				console.info(123);
				this.transitionToRoute('project-sort')
				// window.location.reload();
			})
			// this.transitionToRoute('project-sort')
		}
	}
});