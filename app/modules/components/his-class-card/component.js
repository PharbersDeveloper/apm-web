import Component from '@ember/component';

export default Component.extend({
	classNames: ['col-md-4'],
	localClassNames: 'ember-view',
	actions: {
		lookOver(paperid, courseid) {
			this.sendAction('lookOver', paperid, courseid)
		},
		continue (paperid, courseid) {
			this.sendAction('continue', paperid, courseid)
		}
	}
});