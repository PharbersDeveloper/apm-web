import Component from '@ember/component';

export default Component.extend({
	actions: {
		exitSystem() {
			this.sendAction('exitSystem');
		}
	}
});