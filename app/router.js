import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('project-sort');
  this.route('new-project');
  this.route('history-project');
  this.route('project-start');
});

export default Router;
