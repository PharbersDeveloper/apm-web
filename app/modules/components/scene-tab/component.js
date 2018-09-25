import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    introduced: inject('introduced-service'),
    actions: {
        showScenario(name) {
            this.get('introduced').set('isSelectedName', name)
        },
        showProduct(name) {
            this.get('introduced').set('isSelectedName', name)
        },
        showArea(name) {
            this.get('introduced').set('isSelectedName', name)
        }
    }
});
