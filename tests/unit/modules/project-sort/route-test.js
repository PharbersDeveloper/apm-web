import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | project-sort', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:project-sort');
    assert.ok(route);
  });
});
