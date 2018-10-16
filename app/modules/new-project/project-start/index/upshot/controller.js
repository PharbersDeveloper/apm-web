import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
		saveUpshot() {
			console.log('saveUpshot');
			this.set('tipsModal', true);
			this.set('tipsContent', '本次课程中的内容将进行保存。<br/>您将可以在“历史报告”中查看本次的课程内容与结果。')
		},
		confirmSaveUpshot() {
			this.transitionToRoute('project-sort')
		}
	}
});