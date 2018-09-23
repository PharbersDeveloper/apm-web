import Service from '@ember/service';

export default Service.extend({
    isSelectedName: 'showScenario',
    actions: {
        showScenario(name) {
            this.set('isSelectedName', name)
        },
        showProduct(name) {
            this.set('isSelectedName', name)
        },
        showArea(name) {
            this.set('isSelectedName', name)
        },
    }
});
