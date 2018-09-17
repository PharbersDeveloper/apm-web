import Component from '@ember/component';

export default Component.extend({
    actions: {
        scene() {
            console.info("transition")
            this.transitionToRoute('product-info');
        }
    }
});
