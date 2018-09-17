import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | regional-info', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:regional-info');
    assert.ok(route);
  });
});
