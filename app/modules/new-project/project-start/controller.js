import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
	introduced: inject('introduced-service'),
	actions: {
		close() {
			this.get('introduced').set('isSelectedName', '')
		}
	}
});