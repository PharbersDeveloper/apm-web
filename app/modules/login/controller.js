import Controller from '@ember/controller';

export default Controller.extend({
    login() {
        this.transitionToRoute('perfect-info');
    }
});
