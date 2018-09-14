import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | perfect-info', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:perfect-info');
    assert.ok(route);
  });
});
