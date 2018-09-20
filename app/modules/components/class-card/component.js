import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
    str:true,
    titleone:computed('params.[]', function() {
        console.log(this.params[0]);
    }),
    actions: {
        skip() {
            this.sendAction('skip', this)
        },
        goScenarioDescribe() {
            this.sendAction('goScenarioDescribe', this)
        },
        sendTitle(title) {
            this.set('startTip',true);
            this.set('newtitle',title);
        }
    }
});
