import Component from '@ember/component';

export default Component.extend({
    init() {
        this._super(...arguments);
    },
    actions: {
        close() {
            this.sendAction('close')
        }
    }
});
