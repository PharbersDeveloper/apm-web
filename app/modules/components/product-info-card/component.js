import Component from '@ember/component';

export default Component.extend({
	localClassNames: 'product-container',
	actions: {
		close() {
			this.sendAction('close')
		}
	}
});
