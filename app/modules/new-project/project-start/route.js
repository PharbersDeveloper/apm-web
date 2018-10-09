import Route from '@ember/routing/route';
import { later } from '@ember/runloop';

export default Route.extend({
    groupBy(objectArray, property) {
        return objectArray.reduce(function(acc, obj) {
            var key = obj[property];
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});
    },
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
        let lineData = [];

        /**
         * 备注：Promise的链式调用，未做catch处理
         */
        this.store.queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions)
            .then(data => { // 处理公司产品
                data.forEach(elem => {
                    elem.set('compete', false)
                    medicines.pushObject(elem)
                });
                return data;
            })
            .then(data => { // 获取公司的竞品
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
            .then(data => { // 处理竞品
                data.forEach(reVal => {
                    reVal.forEach(elem => {
                        medicines.pushObject(elem)
                    })
                })
                return medicines;
            })
            .then(data => { // 获取折线图数据
                let req = this.store.createRecord('request', {
                    res: 'bind_course_region_goods_ym_sales',
                    fmcond: this.store.createRecord('fmcond', {
                        skip: 0,
                        take : 1000
                    })
                });
                let promiseArray = data.map(elem => {
                    let eqValues = [
                        { type: 'eqcond', key: 'course_id', val: courseid },
                        { type: 'eqcond', key: 'goods_id', val: elem.id },
                        { type: 'gtecond', key: 'ym', val: '17-01' },
                        { type: 'ltecond', key: 'ym', val: '17-12' },
                    ]
                    let conditions = _conditions(req, eqValues)
                    return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
                });
                return Promise.all(promiseArray)
            })
            .then(data => { // 处理折线图数据
                /**
                 * 没直接取上一个数据，是因为还需要做很多麻烦处理，执行到这一步就表明bind_course_region_goods_ym_sales这个model里面已经有值了
                 * 既然只读取一次，何不全部读取出来
                 */
                let that = this;
                function d3Data(medicineArrayObject) {
                    Object.keys(medicineArrayObject).forEach(key => {
                        let temp = that.groupBy(medicineArrayObject[key], 'ym');
                        let record = that.store.peekRecord('medicine', key);
                        let values = Object.keys(temp).map(elem => {
                            let sum = temp[elem].reduce((acc, cur) => acc + cur.sales.share, 0);
                            return {
                                ym: elem,
                                value: sum
                            }
                        });
                        lineData.pushObject({
                            name: record.corp_name,
                            values
                        });
                    })
                }
                let medicineList = this.store.peekAll('bind_course_region_goods_ym_sales');

                let medicineCompany = this.groupBy(medicineList.filter(elem => elem.region_id !== 'all'), 'goods_id');
                let medicineCompete = this.groupBy(medicineList.filter(elem => elem.region_id === 'all'), 'goods_id');
                d3Data(medicineCompany)
                d3Data(medicineCompete)
            })
            .finally( () => {
                let productInfo = {
                    medicines,
                    lineData
                }
                controller.set('ProductModel', productInfo);
                // this.areaInfo(courseid, controller)
            })
    },
    areaInfo(courseid, controller) {
        let regionBaseInfo = {}
        // let regionInfoCards = [];
        // 获取所有区域名称与基本信息
        let req = this.store.createRecord('request', { res: 'bind_course_region' });
        req.get('eqcond').pushObject(this.store.createRecord('eqcond', {
            key: 'course_id',
            val: courseid,
        }))
        let conditions = this.store.object2JsonApi('request', req);

        this.store.queryMultipleObject('/api/v1/regionLst/0', 'region', conditions)
            .then(data => { // 处理区域基本数据
                regionBaseInfo.info = data;
                return data;
            })
            .then(data => { // 处理cards数据
                regionBaseInfo.cards = [];
                let regionData = this.store.peekAll('bind_course_region_goods_ym_sales');
                data.forEach(elem => {
                    let filtrerData = regionData.filter(felem => felem.region_id == elem.id);
                    regionBaseInfo.cards.pushObject(filtrerData.lastObject)
                });
            })
            .finally(() => {
                controller.set('AreaModel', regionBaseInfo);
            })

        req = this.store.createRecord('request', { res: 'bind_course_region_radar' });
        req.get('eqcond').pushObject(this.store.createRecord('eqcond', {
            key: 'course_id',
            val: courseid,
        }))
        conditions = this.store.object2JsonApi('request', req);

        this.store.queryMultipleObject('/api/v1/findRadarFigure/0', 'bind_course_region_radar', conditions).then(data => {
            console.info(data)
        }).finally(() => {

        })
        
    },
    model(ids) {
        let projectController = this.controllerFor('new-project.project-start');
        // 场景介绍
        this.scenarioInfo(ids.courseid, projectController)
        this.productInfo(ids.courseid, projectController)
        this.areaInfo(ids.courseid, projectController)

        return {
            ids,
            // 'scenario':  this.scenarioInfo(ids.courseid, projectController),
            // 'product': this.productInfo(ids.courseid, projectController),
            // 'area': this.areaInfo(ids.courseid, projectController)
        }
    }
});
