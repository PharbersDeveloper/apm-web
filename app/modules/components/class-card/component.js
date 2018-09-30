import Component from '@ember/component';

export default Component.extend({
	actions: {
		skip() {
			this.sendAction('skip', this);
		},
		goScenarioDescribe() {
			this.sendAction('goScenarioDescribe', this);
		},
		sendTitle(title, content, projectid) {
			this.set('startTip', true);
            this.set('newtitle', title);
            this.set('content', content);
            this.set('projectid', projectid)
		}
	}
});