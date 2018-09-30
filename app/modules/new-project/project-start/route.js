import Route from '@ember/routing/route';
import { later } from '@ember/runloop';

export default Route.extend({
    scenarioInfo(courseid, controller) {
        later(this, function() {
            let courseRecord = this.store.peekRecord('course', courseid);
            let data = {
                content: courseRecord.describe,
                image: localStorage.getItem('userImage') 
            }
            controller.set('ScenarioModel', data);
        }, 100)
    },
    productInfo(courseid, controller) {
        later(this, function() {
            let req = this.store.createRecord('request', { 
                res: 'bind_course_goods',
                fmcond: this.store.createRecord('fmcond', {
                    skip: 0,
                    take: 20
                })
            });
            req.get('eqcond').pushObject(this.store.createRecord('eqcond', {
                key: 'course_id',
                val: courseid,
            }));
            let conditions = this.store.object2JsonApi('request', req);
            let medicines = [];
            
            this.store.queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions).
                then(data => {
                    data.forEach(elem => {
                        let req = this.store.createRecord('request', { 
                            res: 'bind_course_goods_compet',
                            fmcond: this.store.createRecord('fmcond', {
                                skip: 0,
                                take: 20
                            })
                        });
                        let eqValues = [
                            { type: 'eqcond', key: 'course_id', val: courseid },
                            { type: 'eqcond', key: 'goods_id', val: elem.id },
                        ]
                        eqValues.forEach((elem, index) => {
                            req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
                                key: elem.key,
                                val: elem.val,
                            }))
                        });
                        let conditions = this.store.object2JsonApi('request', req);
                        elem.set('compete', false)
                        medicines.pushObject(elem)
                        this.store.queryMultipleObject('/api/v1/findCompetGoods/0', 'medicine', conditions).then(data => {
                            data.forEach(elem => {
                                elem.set('compete', true)
                                medicines.pushObject(elem)       
                            })
                        })
                    });
                });
            let productInfo = {
                medicines
            }
            controller.set('ProductModel', productInfo);

        }, 100)
    },
    model(courseId) {
        let projectController = this.controllerFor('new-project.project-start');
        //场景介绍
        this.scenarioInfo(courseId.id, projectController)
        this.productInfo(courseId.id, projectController)
    }
});
