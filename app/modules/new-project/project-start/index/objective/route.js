import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';

export default Route.extend({
    loadD3Data(paramsController, controller) {
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
        let temp = [];
        let medicines = this.store.peekAll('medicine');
        let promiseArray = medicines.map(elem => {
            let req = this.store.createRecord('request', {
                res: 'bind_course_region_goods_ym_sales',
                fmcond: this.store.createRecord('fmcond', {
                    skip: 0,
                    take : 1000
                })
            });

            let eqValues = [
                { type: 'eqcond', key: 'course_id', val: paramsController.courseid },
                { type: 'eqcond', key: 'goods_id', val: elem.id },
                { type: 'gtecond', key: 'ym', val: '17-01' },
                { type: 'ltecond', key: 'ym', val: '18-03' }]

            eqValues.forEach(elem => {
                req.get(elem.type).pushObject(this.store.createRecord(elem.type, { key: elem.key, val: elem.val }))
            });
            let conditions = this.store.object2JsonApi('request', req);
            return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
        });
        
        return Promise.all(promiseArray).then(data => {
            data.forEach(elem => {elem.forEach(good => temp.pushObject(good)) });
            let areaBarData = d3Data(groupBy(temp.filter(elem => elem.region_id !== 'all'), 'region_id'));
            controller.set('areaBarData', areaBarData);
            controller.set('barData', areaBarData.find(elem => elem.region_id === controller.get('initSelectedRegionId')).data)
            return areaBarData
        })
    },
	model() {
        let paramsController = this.modelFor('new-project.project-start');
        let controller = this.controllerFor('new-project.project-start.index.objective')
        let region = this.store.peekAll('region')
        
        controller.set('params', paramsController);
        controller.set('regionData', region);
        controller.set('initSelectedRegionId', region.firstObject.id);

        let goodsByRegion = groupBy(this.store.peekAll('bind-course-region-goods-ym-sales').filter(elem => elem.region_id !== 'all'), 'region_id')
        let regionCompanyTargets = Object.keys(goodsByRegion).map(key => {
            return {
                region_id: key,
                company_targe: goodsByRegion[key].lastObject.sales.company_target
            }
        })
        controller.set('regionCompanyTargets', regionCompanyTargets)
        
        return this.loadD3Data(paramsController, controller)
        
	},
	activate() {
		this.controllerFor('new-project.project-start.index.objective').set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
		// this.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
	},
});