import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
    cookies: inject(),
    init(){
        this._super(...arguments);
        this.set('history',  JSON.parse(localStorage.getItem('history')));
    },
	actions: {
		saveUpshot() {
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
				localStorage.removeItem('regionResort')
			    localStorage.removeItem('totalRegion')
				return resolve(true)
			}).then(data => {
				this.transitionToRoute('project-sort')
			})
		}
	}
});