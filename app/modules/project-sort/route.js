import Route from '@ember/routing/route';

export default Route.extend({
    actions: {
        startNewProject() {
            // this.store.queryObject().then(rval => {});
            this.transitionTo('new-project');
        },
        historyProject() {
            this.transitionTo('history-project');
        }
    }
});
