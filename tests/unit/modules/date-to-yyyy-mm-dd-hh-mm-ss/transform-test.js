import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('transform:date-to-yyyy-mm-dd-hh-mm-ss', 'Unit | Transform | date to yyyy mm dd hh mm ss', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let transform = this.owner.lookup('transform:date-to-yyyy-mm-dd-hh-mm-ss');
    assert.ok(transform);
  });
});
