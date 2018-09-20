import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | new-project/project-start/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:new-project/project-start/index');
    assert.ok(route);
  });
});
