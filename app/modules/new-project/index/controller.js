import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
    introduced: inject('introduced-service'),
    getPaper(courseid) {
        let courseRecord = this.store.peekRecord('course', courseid);
        let paper = this.store.createRecord('paper', {
            id: '-100',
            course: courseRecord
        });
        let conditions = this.store.object2JsonApi('paper', paper, false);
        this.store.peekRecord('paper', '-100').destroyRecord().then( rec => rec.unloadRecord());
        return this.store.queryObject('/api/v1/exam/0', 'paper', conditions)
    },
    actions: {
        skip(component) {
            component.set('startTip', false);
            this.getPaper(component.get('courseid')).then(data => {
                this.transitionToRoute('new-project.project-start.index.analyze', component.get('courseid'), data.id)
            })
        },
        goScenarioDescribe(component) {
            component.set('startTip', false);
            this.get('introduced').set('isSelectedName', 'showScenario');
            this.getPaper(component.get('courseid')).then(data => {
                this.transitionToRoute('new-project.project-start.index.analyze', component.get('courseid'), data.id)
            })
            
        }
    }
});
