import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';

export default Route.extend({
	_conditions(request, anyConditions) {
		anyConditions.forEach((elem, index) => {
			request.get(elem.type).pushObject(request.store.createRecord(elem.type, {
				id: elem.id,
				key: elem.key,
				val: elem.val,
			}))
		});
		return request.store.object2JsonApi(request);
	},
	_d3Data(medicineArrayObject) {
		return Object.keys(medicineArrayObject).map(key => {
			return {
				region_id: key,
				data: medicineArrayObject[key].map(elem => {
					return {
						key: elem.time,
						value: elem.unit.unit,
						value2: (elem.unit.share * 100).toFixed(1)
					}
				})
			}
		})
	},

	model() {
		let ids = this.modelFor('new-project.project-start');
		let paramsController = this.modelFor('new-project.project-start');
		let controller = this.controllerFor('new-project.project-start.index.objective')
		// 获取所有区域名称与基本信息
		let req = this.get('pmController').get('Store').createModel('request', { id: 'totalR', res: 'bind_course_region' });
		req.get('eqcond').pushObject(this.get('pmController').get('Store').createModel('eqcond', {
			id: 'totalReq0',
			key: 'course_id',
			val: ids.courseid,
		}))
		let conditions = this.get('pmController').get('Store').object2JsonApi(req);

		return this.get('pmController').get('Store').queryMultipleObject('/api/v1/regionLst/0', 'region', conditions)
			.then(data => { // 处理区域基本数据
				controller.set('params', paramsController);
				controller.set('regionData', data);
				controller.set('initSelectedRegionId', data.firstObject.id);
				return data;
			})
			// .then((data) => {
			// 	return this.loadD3Data(paramsController, controller, ids);
			// })
			.then(() => {
				let req = this.get('pmController').get('Store').createModel('request', {
					id: 'objective0',
					res: 'bind_course_goods',
					fmcond: this.get('pmController').get('Store').createModel('fmcond', {
						id: 'fm01',
						skip: 0,
						take: 20
					})
				});

				let eqValues = [{ id: 'objective1', type: 'eqcond', key: 'course_id', val: ids.courseid }]

				let conditions = this._conditions(req, eqValues);
				return this.get('pmController').get('Store')
					.queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions)
			})
			.then(data => { // 处理公司产品 并获取公司产品月度销售数据
				data.forEach(elem => {
					elem.set('compete', false)
				});
				let req = this.get('pmController').get('Store').createModel('request', {
					id: 'objectiveCompete0',
					res: 'bind_course_region_goods_time_unit',
					fmcond: this.get('pmController').get('Store').createModel('fmcond', {
						id: 'objectiveCompeteFm1',
						skip: 0,
						take: 1000
					})
				});

				let eqValues = [
					{ id: 'objectiveCompete5', type: 'eqcond', key: 'time_type', val: 'month' },
					{ id: 'objectiveCompete1', type: 'eqcond', key: 'course_id', val: paramsController.courseid },
					{ id: 'objectiveCompete2', type: 'eqcond', key: 'goods_id', val: data.firstObject.id },
					{ id: 'objectiveCompete3', type: 'gtecond', key: 'time', val: '17-01' },
					{ id: 'objectiveCompete4', type: 'ltecond', key: 'time', val: '18-03' }
				];

				eqValues.forEach(elem => {
					req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, { id: elem.id, key: elem.key, val: elem.val }))
				});
				let conditions = this.get('pmController').get('Store').object2JsonApi(req);
				return this.get('pmController').get('Store')
					.queryMultipleObject('/api/v1/findAllMedUnit/0', 'bind_course_region_goods_time_unit', conditions);
			})
			.then((data) => { // 处理月度数据
				let temp = [];
				let contTemp = [];
				data.forEach((elem) => {
					if (elem.time.indexOf('q') < 0) {
						temp.pushObject(elem)
					} else {
						contTemp.pushObject(elem)
					}
				});

				let predictionData = temp.filter(elem => elem.time === '18-01' || elem.time === '18-02' || elem.time === '18-03')
				let predictionGroupData = groupBy(predictionData, 'region_id')
				let regionCompanyTargets = Object.keys(predictionGroupData).map(key => {
					return {
						region_id: key,
						company_targe: predictionGroupData[key].reduce((acc, cur) => acc + cur.unit.company_target, 0)
					}
				})

				controller.set('regionCompanyTargets', regionCompanyTargets);
				controller.set('totalCompanyTarget', predictionData.reduce((acc, cur) => acc + cur.unit.company_target, 0))

				let areaBarData = this._d3Data(groupBy(temp.filter(elem => elem.region_id !== 'all'), 'region_id'));
				areaBarData.forEach((item) => {
					console.log(item);
					item.data.sort((a, b) => {
						return (a.key.slice(0, 2) + a.key.slice(3)) - (b.key.slice(0, 2) + b.key.slice(3))
					})
				})
				controller.set('areaBarData', areaBarData);
				controller.set('barData', areaBarData.find(elem => elem.region_id === controller.get('initSelectedRegionId')).data)

				return areaBarData;
			})
			.then((data) => { // 获取公司产品季度数据
				let medicines = this.get('pmController').get('Store').peekAll('medicine');
				let companyProd = medicines.find((item) => {
					return !item.compete;
				});
				let req = this.get('pmController').get('Store').createModel('request', {
					id: 'objectiveCompete0',
					res: 'bind_course_region_goods_time_unit',
					fmcond: this.get('pmController').get('Store').createModel('fmcond', {
						id: 'objectiveCompeteFm1',
						skip: 0,
						take: 1000
					})
				});

				let eqValues = [
					{ id: 'objectiveCompete5', type: 'eqcond', key: 'time_type', val: 'season' },
					{ id: 'objectiveCompete1', type: 'eqcond', key: 'course_id', val: paramsController.courseid },
					{ id: 'objectiveCompete2', type: 'eqcond', key: 'goods_id', val: companyProd.id },
					{ id: 'objectiveCompete3', type: 'gtecond', key: 'time', val: '17-q1' },
					{ id: 'objectiveCompete4', type: 'ltecond', key: 'time', val: '18-q1' }
				];

				eqValues.forEach(elem => {
					req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, { id: elem.id, key: elem.key, val: elem.val }))
				});
				let conditions = this.get('pmController').get('Store').object2JsonApi(req);
				return this.get('pmController').get('Store')
					.queryMultipleObject('/api/v1/findAllMedUnit/0', 'bind_course_region_goods_time_unit', conditions);
			})
			.then((data) => { // 处理公司产品季度数据
				let _predictionDataForContri = data.filter(elem => elem.time === '17-q4');
				let _predictionGroupDataForContri = groupBy(_predictionDataForContri, 'region_id');
				let regionSalesContri = Object.keys(_predictionGroupDataForContri).map(key => {
					return {
						region_id: key,
						sales_contri: _predictionGroupDataForContri[key].reduce((acc, cur) => acc + cur.unit.contri, 0)
					}
				});
				controller.set('regionSalesContri', regionSalesContri);
				return null;
			})

	},
	activate() {
		this.controllerFor('new-project.project-start.index.objective').set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
		// this.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
	},
});
