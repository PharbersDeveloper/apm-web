import Route from '@ember/routing/route';
import { later } from '@ember/runloop';

export default Route.extend({
    scenarioInfo(courseid, controller) {
        let courseRecord = this.store.peekRecord('course', courseid);
        let data = {
            content: courseRecord.describe,
            image: localStorage.getItem('userImage')
        }
        controller.set('ScenarioModel', data);
    },
    productInfo(courseid, controller) {

        function _conditions(request, anyConditions) {
            anyConditions.forEach((elem, index) => {
                request.get(elem.type).pushObject(request.store.createRecord(elem.type, {
                    key: elem.key,
                    val: elem.val,
                }))
            });
            return request.store.object2JsonApi('request', request);
        }

        let req = this.store.createRecord('request', {
            res: 'bind_course_goods',
            fmcond: this.store.createRecord('fmcond', {
                skip: 0,
                take: 20
            })
        });

        let eqValues = [{ type: 'eqcond', key: 'course_id', val: courseid }]

        let conditions = _conditions(req, eqValues);
        let medicines = [];

        /**
         * 备注：Promise的链式调用，未做catch处理
         */
        this.store.queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions)
            .then(data => {
                data.forEach(elem => {
                    elem.set('compete', false)
                    medicines.pushObject(elem)
                });
                return data;
            })
            .then(data => {
                let that = this;
                let promiseArray =  data.map(reval => {
                    let req = that.store.createRecord('request', {
                        res: 'bind_course_goods_compet',
                        fmcond: that.store.createRecord('fmcond', {
                            skip: 0,
                            take: 20
                        })
                    });
                    let eqValues = [
                        { type: 'eqcond', key: 'course_id', val: courseid },
                        { type: 'eqcond', key: 'goods_id', val: reval.id },
                    ]
                    let conditions = _conditions(req, eqValues);
                    return that.store.queryMultipleObject('/api/v1/findCompetGoods/0', 'medicine', conditions)
                });
                return Promise.all(promiseArray)
            })
            .then(data => {
                data.forEach(reVal => {
                    reVal.forEach(elem => {
                        medicines.pushObject(elem)
                    })
                })
                return medicines;
            })
            .then(data => {
                /**
                 * 备注：数据不全无法继续
                 */
                // let req = this.store.createRecord('request', {
                //     res: 'bind_course_region_goods_ym_sales'
                // });
                // let promiseArray = data.map(elem => {
                //     let eqValues = [
                //         { type: 'eqcond', key: 'course_id', val: courseid },
                //         { type: 'eqcond', key: 'goods_id', val: elem.id },
                //         { type: 'eqcond', key: 'region_id', val: 'all' },
                //         { type: 'gtecond', key: 'ym', val: '17-01' },
                //         { type: 'ltecond', key: 'ym', val: '17-02' },
                //     ]
                //     let conditions = _conditions(req, eqValues)
                //     return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'medicine', conditions)
                // });
                // return Promise.all(promiseArray)
            })
            .then(data => {
                console.info(data)
            })
            .finally( () => {
                let productInfo = {
                    medicines
                }
                controller.set('ProductModel', productInfo);
            })

        /**
         * 产品信息份额折线图
         */
        // let t = medicines.filter(elem => elem.compete === false)

        let productInfo = {
            medicines
        }
        controller.set('ProductModel', productInfo);
    },
    model(ids) {
        let projectController = this.controllerFor('new-project.project-start');
        //场景介绍
        later(this, function () {
            this.scenarioInfo(ids.courseid, projectController)
            this.productInfo(ids.courseid, projectController)
        }, 100)

    }
});
