import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
	introduced: inject('introduced-service'),
	actions: {
		showScenario(name) {
			this.get('introduced').set('isSelectedName', name);
			this.sendAction('changeTab', name);
		},
		showProduct(name) {
			this.get('introduced').set('isSelectedName', name);
			this.sendAction('changeTab', name);
		},
		showArea(name) {
			this.get('introduced').set('isSelectedName', name);
			this.sendAction('changeTab', name);
		},
		exit() {
			let hint = {
				hintModal: true,
				hintImg: true,
				title: '提示',
				content: '将保存您当前的填写纪录,未完成的课程,可在 "历史项目>进行中" ,继续完成.',
				hintBtn: true,
			}
			this.set('hint', hint);
		},
		exitTest() {
			localStorage.removeItem('regionResort')
			localStorage.removeItem('totalRegion')
			window.location = '/project-sort'
		}
	}
});