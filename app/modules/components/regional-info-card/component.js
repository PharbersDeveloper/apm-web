import Component from '@ember/component';

export default Component.extend({
	actions: {
		close() {
			this.sendAction('close')
		},
		changeRegion(tab, id) {
			// console.log(id);
			tab.select(id);
			this.sendAction('changeRegion', this, id)
		},
	}
});