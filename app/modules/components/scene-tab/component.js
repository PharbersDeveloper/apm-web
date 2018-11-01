import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
	i18n:inject(),
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
				title: this.i18n.t('apm.component.sceneTab.tips') + "",
				content: this.i18n.t('apm.component.sceneTab.tipContent') + "",
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