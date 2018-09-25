import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
    introduced: inject('introduced-service'),
    actions: {
        skip(component) {
            component.set('startTip', false);
            this.transitionToRoute('new-project.project-start.index.analyze')
            
        },
        goScenarioDescribe(component) {
            component.set('startTip', false);
            this.get('introduced').set('isSelectedName', 'showScenario');
            this.transitionToRoute('new-project.project-start.index.analyze');
        }
    }
});
