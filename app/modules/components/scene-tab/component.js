import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({

	i18n: inject(),
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
			let history = JSON.parse(localStorage.getItem('history'));

			if (history) {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: this.get('i18n').t('apm.component.sceneTab.tips') + "",
					content: '确认退出？',
					hintBtn: true,
				}
				this.set('hint', hint);
			} else {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: this.get('i18n').t('apm.component.sceneTab.tips') + "",
					content: this.get('i18n').t('apm.component.sceneTab.tipContent') + "",
					hintBtn: true,
				}
				this.set('hint', hint);
			}
		},
		exitTest() {
			localStorage.removeItem('regionResort')
			localStorage.removeItem('totalRegion')
			window.location = '/project-sort'
		}
	}
});
