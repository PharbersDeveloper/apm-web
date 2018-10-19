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
		exitTest() {
			localStorage.removeItem('regionResort')
			localStorage.removeItem('totalRegion')
			window.location = '/project-sort'
		}
	}
});