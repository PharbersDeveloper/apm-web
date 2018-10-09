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
                this.areaInfo(courseid, controller)
            })
    },
    areaInfo(courseid, controller) {
        let regionBaseInfo = {}
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
                return null
            })
            .then(() => { // 获取雷达图数据
                req = this.store.createRecord('request', { res: 'bind_course_region_radar' });
                req.get('eqcond').pushObject(this.store.createRecord('eqcond', {
                    key: 'course_id',
                    val: courseid,
                }))
                conditions = this.store.object2JsonApi('request', req);
                return this.store.queryMultipleObject('/api/v1/findRadarFigure/0', 'bind_course_region_radar', conditions)
            })
            .then(data => { // 处理雷塔图数据
                let radarArray = data.filter(elem => elem.region_id !== 'ave');
                let ave = data.find(elem => elem.region_id === 'ave');
                function axes(radarfigure) {
                    let axes = [];
                    axes.pushObject({
                        axis: '产品知识',
                        value: radarfigure.prod_knowledge_val
                    })
    
                    axes.pushObject({
                        axis: '目标拜访频次',
                        value: radarfigure.target_call_freq_val
                    })
    
                    axes.pushObject({
                        axis: '拜访次数',
                        value: radarfigure.call_times_val
                    })
    
                    axes.pushObject({
                        axis: '实际工作天数',
                        value: radarfigure.in_field_days_val
                    })
    
                    axes.pushObject({
                        axis: '工作积极性',
                        value: radarfigure.motivation_val
                    })
    
                    axes.pushObject({
                        axis: '区域管理能力',
                        value: radarfigure.territory_manage_val
                    })
    
                    axes.pushObject({
                        axis: '销售能力',
                        value: radarfigure.sales_skills_val
                    })
                    return axes
                }
                let radarData = radarArray.map(elem => {
                    let regionCache = this.store.peekRecord('region', elem.region_id);
                    return {
                        region_id: elem.region_id,
                        data: [
                            {
                                name: regionCache.name,
                                axes: axes(elem.radarfigure),
                                color: '#26AF32'
                            },
                            {
                                name: '区域平均',
                                axes: axes(ave.radarfigure),
                                color: '#762712'
                            }
                        ]
                    }
                });
                regionBaseInfo.radarData = radarData;
                return null;
            })
            .then(() => { // 获取所有区域的负责代表
                let regionCache = this.store.peekAll('region');
                let promiseArray = regionCache.map(elem => {
                    req = this.store.createRecord('request', { res: 'bind_course_region_rep' });
                    let eqValues = [
                        { type: 'eqcond', key: 'region_id', val: elem.id},
                        { type: 'eqcond', key: 'course_id', val: courseid },
                    ]
                    eqValues.forEach((elem) => {
                        req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
                            key: elem.key,
                            val: elem.val,
                        }))
                    });
                    conditions = this.store.object2JsonApi('request', req);
                    return this.store.queryMultipleObject('/api/v1/findRegionRep/0', 'representative', conditions)
                })
                return Promise.all(promiseArray)
            })
            .then(data => { // 处理所有区域的负责代表
                regionBaseInfo.represents = [];
                data.forEach(elem => {
                    regionBaseInfo.represents.pushObject({
                        region_id: elem.query.included[0].attributes.val,
                        data: elem
                    })
                })
                return null
            })
            .then(() => { // 获取kpi表格数据
                let regionCache = this.store.peekAll('region');
                let promiseArray = regionCache.map(elem => {
                    req = this.store.createRecord('request', {res: 'bind_course_region_ym_rep_behavior'});
                    let eqValues = [
                        { type: 'eqcond', key: 'region_id', val: elem.id},
                        { type: 'eqcond', key: 'course_id', val: courseid },
                        { type: 'gtecond', key: 'ym', val: '17-01' },
                        { type: 'ltecond', key: 'ym', val: '17-12' },
                    ]
                    eqValues.forEach((elem) => {
                        req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
                            key: elem.key,
                            val: elem.val,
                        }))
                    });
                    let conditions = this.store.object2JsonApi('request', req);
                    return this.store.queryMultipleObject('/api/v1/findRepBehavior/0', 'bind_course_region_ym_rep_behavior', conditions)
                })
                return Promise.all(promiseArray)
            })
            .then(data => { // 处理KPI表格数据
                let kpi = []
                data.forEach(elem => {
                    let region_id = elem.firstObject.region_id
                    let yms = elem.map(ele => ele.ym)
                    let target_call_freq_vals = elem.map(ele => ele.repbehaviorreport.target_call_freq_val);
                    let in_field_days_vals = elem.map(ele => ele.repbehaviorreport.in_field_days_val);
                    let call_times_vals = elem.map(ele => ele.repbehaviorreport.call_times_val);
                    kpi.pushObject({
                        region_id,
                        yms,
                        target_call_freq_vals,
                        in_field_days_vals,
                        call_times_vals
                    })
                });
                regionBaseInfo.kpi = kpi
                return null
            })
            .then(() => { // 获取业务报告数据
                let regionCache = this.store.peekAll('region');
                let promiseArray = regionCache.map(elem => {
                    req = this.store.createRecord('request', {res: 'bind_course_region_business'});
                    let eqValues = [
                        { type: 'eqcond', key: 'region_id', val: elem.id},
                        { type: 'eqcond', key: 'course_id', val: courseid }
                    ]
                    eqValues.forEach((elem) => {
                        req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
                            key: elem.key,
                            val: elem.val,
                        }))
                    });
                    let conditions = this.store.object2JsonApi('request', req);
                    return this.store.queryMultipleObject('/api/v1/findBusinessReport/0', 'bind_course_region_business', conditions)
                })
                return Promise.all(promiseArray)
            })
            .then(data => { // 处理业务报告数据
                let reports = data.map(elem => {
                    let content = elem.map(ele => {
                        return {
                            title: ele.businessreport.title,
                            des: ele.businessreport.description
                        }
                    })
                    return {
                        region_id: elem.query.included[0].attributes.val,
                        data: content
                    }
                });
                regionBaseInfo.reports = reports
                return null
            })
            .then(() => { // 
                function d3Data(medicineArrayObject) {
                    return Object.keys(medicineArrayObject).map(key => {
                        return {
                            region_id: key,
                            data: medicineArrayObject[key].map(elem => {
                                return {
                                    key: elem.ym,
                                    value: elem.sales.sales,
                                    value2: elem.sales.share
                                }
                            })
                        }
                    })
                }
                let medicineList = this.store.peekAll('bind_course_region_goods_ym_sales');
                let medicineByRegion = this.groupBy(medicineList.filter(elem => elem.region_id !== 'all'), 'region_id');
                regionBaseInfo.salesBar = d3Data(medicineByRegion)
            })
            .finally(() => {
                controller.set('AreaModel', regionBaseInfo);
            })        
        
    },
    model(ids) {
        let projectController = this.controllerFor('new-project.project-start');
        // 场景介绍
        this.scenarioInfo(ids.courseid, projectController)
        this.productInfo(ids.courseid, projectController)
        // this.areaInfo(ids.courseid, projectController)

        return {
            ids,
            // 'scenario':  this.scenarioInfo(ids.courseid, projectController),
            // 'product': this.productInfo(ids.courseid, projectController),
            // 'area': this.areaInfo(ids.courseid, projectController)
        }
    }
});
