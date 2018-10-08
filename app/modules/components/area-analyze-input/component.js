import Component from '@ember/component';

export default Component.extend({
	collapsed: false,
	actions: {
		toggle() {
			this.toggleProperty('collapsed')
		},
		keyUp() {
			this.sendAction('saveToLocalStorage');
		}
	}
});