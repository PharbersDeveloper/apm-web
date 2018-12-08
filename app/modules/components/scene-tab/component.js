import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
	i18n: inject(),
	introduced: inject('introduced-service'),
	localClassNames: 'scene-tab-container',
	tagName: 'nav',
	exitBtnShow: false,
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
		showExit() {
			this.toggleProperty('exitBtnShow')
		},
		exit() {
			let history = JSON.parse(localStorage.getItem('history')),
				hint = null;

			if (history) {
				hint = {
					hintModal: true,
					hintImg: true,
					title: this.get('i18n').t('apm.component.sceneTab.tips') + "",
					content: '确认退出？',
					hintBtn: true,
				}
				this.set('hint', hint);
			} else {
				if (this.get('isFinish')) {
					hint = {
						hintModal: true,
						hintImg: true,
						title: this.get('i18n').t('apm.component.sceneTab.tips') + "",
						content: this.get('i18n').t('apm.component.sceneTab.tipContentFinish') + "",
						hintBtn: true,
					}
				} else {
					hint = {
						hintModal: true,
						hintImg: true,
						title: this.get('i18n').t('apm.component.sceneTab.tips') + "",
						content: this.get('i18n').t('apm.component.sceneTab.tipContent') + "",
						hintBtn: true,
					}
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
