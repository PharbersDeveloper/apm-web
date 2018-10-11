import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		let paramsController = this.modelFor('new-project.project-start');
        this.controllerFor('new-project.project-start.index.resource').set('params', paramsController);
        
        let req = this.store.createRecord('request', { res: 'bind_course_exam_require' });

        let eqValues = [
            { type: 'eqcond', key: 'course_id', val: paramsController.courseid },
        ]

        eqValues.forEach((elem, index) => {
            req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
                key: elem.key,
                val: elem.val,
            }))
        });
        let conditions = this.store.object2JsonApi('request', req);

        let reVal = this.store.queryObject('/api/v1/findExamRequire/0', 'examrequire', conditions)
        return reVal
	},
	actions: {

	}
});