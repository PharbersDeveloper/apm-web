import EmberObject from '@ember/object';
import SignupLogicMixin from 'apm-web/mixins/signup-logic';
import { module, test } from 'qunit';

module('Unit | Mixin | signup-logic', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let SignupLogicObject = EmberObject.extend(SignupLogicMixin);
    let subject = SignupLogicObject.create();
    assert.ok(subject);
  });
});
