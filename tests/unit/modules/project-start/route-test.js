import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | project-start', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:project-start');
    assert.ok(route);
  });
});
