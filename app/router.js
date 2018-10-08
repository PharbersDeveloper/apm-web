import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Ember.Route.reopen({
    withLayout: true,
    setupController() {
        this._super(...arguments);
        this.controllerFor('application').set('showNavbar', this.get('withLayout'));
    }
})

Router.map(function () {
    this.route('project-sort');
    this.route('new-project', function () {
        this.route('project-start', { path: '/project-start/:courseid/:paperid'}, function () {
            this.route('index', { path: '/' }, function () {
                this.route('analyze');
                this.route('resource');
                this.route('action-plan');
                this.route('upshot');
                this.route('sort');
                this.route('objective');
            });
        });
    });
    this.route('history-project');
    this.route('perfect-info');
    this.route('sign_up');
    this.route('demo');
});

export default Router;
