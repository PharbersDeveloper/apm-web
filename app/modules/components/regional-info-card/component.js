import Component from '@ember/component';

export default Component.extend({
	localClassNames: 'reginonal-info-container',
	actions: {
		close() {
			this.sendAction('close')
		},
		changeRegion(tab, id) {
			tab.select(id);
			this.sendAction('changeRegion', this, id)
		},
	}
});
