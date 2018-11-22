import Component from '@ember/component';

export default Component.extend({
	collapsed: false,
	actions: {
		toggle() {
			this.toggleProperty('collapsed')
		},
		openTips(data) {
			this.set('hint', {
				hintModal: true,
				hintImg: false,
				title: data.get('name'),
				content: data.get('notes'),
				hintBtn: false,
			})
		}
	}
});
