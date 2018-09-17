import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
    str:true,
    titleone:computed('params.[]', function() {
        console.log(this.params[0]);
    }),
    actions: {
        links() {
            console.log("link to")
            this.transitionTo('project-start');
        },
        sendTitle(title) {
            console.log('ddd')
            this.set('modal3',true);
            this.set('newtitle',title);
        }
    }
});
