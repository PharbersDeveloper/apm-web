import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
	collapsed: false,
	restWord: computed('data.notes', function () {
		return 300 - this.get('data.notes').length
	}),

	actions: {
		toggle() {
			this.toggleProperty('collapsed')
		},
		keyUp() {
			this.sendAction('saveToLocalStorage');
		},
		clearNotes() {
			this.set('data.notes', "")
		}
	}
});