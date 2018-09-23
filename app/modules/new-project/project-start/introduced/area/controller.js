import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        close() {
            this.transitionToRoute('new-project.project-start.index.analyze')
        }
    }
});
