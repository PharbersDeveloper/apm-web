import Component from '@ember/component';

export default Component.extend({
    actions: {
        links() {
            console.log("link to")
            this.transitionTo('project-start');
        },

    }
});
