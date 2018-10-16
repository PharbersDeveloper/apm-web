import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        lookOver(paperid, courseid) {
            console.info(paperid)
        },
        continue(paperid, courseid) {
            console.info(paperid)
        }
    }
});
