import Component from '@ember/component';

export default Component.extend({
	localClassNames: 'header',
	tagName: 'header',
	actions: {
		exitSystem() {
			this.sendAction('exitSystem');
		}
	}
});