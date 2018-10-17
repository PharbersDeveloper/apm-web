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
				title: data.name,
				content: data.notes,
				hintBtn: false,
			})
			// this.set('tipModal', true);
			// this.set('tipsTitle', data.name);
			// this.set('content', data.notes);

		}
	}
});