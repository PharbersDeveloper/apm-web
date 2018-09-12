import Route from '@ember/routing/route';

export default Route.extend({
    model() {
        return {
            prod: "aaaa",
            company: [{
                title: "ccc",
            },{
                title: "bbb",
            }],
            line: {},
        }
    }
});
