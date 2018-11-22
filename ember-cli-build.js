'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
	// 判断是否需要sourceMaps
	let app = new EmberApp(defaults, {
		// Add options here
		'ember-bootstrap': {
			'bootstrapVersion': 3,
			'importBootstrapFont': true,
			'importBootstrapCSS': true
		},
		sassOptions: {
			includePaths: [
				'node_modules/bootstrap-sass/assets/stylesheets'
			]
		},
		babel: {
			sourceMaps: 'inline'
		}
	});
	//第三方静态文件导入
	return app.toTree();
};
