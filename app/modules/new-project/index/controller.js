import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        skip(component) {
            component.set('startTip', false);
            this.transitionToRoute('new-project.project-start.introduced.scenario');
        },
        goScenarioDescribe(component) {
            this.transitionToRoute('new-project.project-start')
        }
    }
});
