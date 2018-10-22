import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';

export default Route.extend({
	loadD3Data(paramsController, controller, ids) {
		function d3Data(medicineArrayObject) {
			return Object.keys(medicineArrayObject).map(key => {
				return {
					region_id: key,
					data: medicineArrayObject[key].map(elem => {
						return {
							key: elem.ym,
							value: elem.sales.sales,
							value2: (elem.sales.share * 100).toFixed(1)
						}
					})
				}
			})
		}
		let temp = [];

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

		let eqValues = [{ type: 'eqcond', key: 'course_id', val: ids.courseid }]

		let conditions = _conditions(req, eqValues);

		return this.store.queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions)
			.then(data => { // 处理公司产品
				data.forEach(elem => {
					elem.set('compete', false)
				});
				return data;
			})
			.then(data => { // 获取公司的竞品
				let that = this;
				console.log(data);
				let promiseArray = data.map(reval => {
					let req = that.store.createRecord('request', {
						res: 'bind_course_goods_compet',
						fmcond: that.store.createRecord('fmcond', {
							skip: 0,
							take: 20
						})
					});
					console.log(reval.id);
					let eqValues = [
						{ type: 'eqcond', key: 'course_id', val: ids.courseid },
						{ type: 'eqcond', key: 'goods_id', val: reval.id },
					]
					let conditions = _conditions(req, eqValues);
					return that.store.queryMultipleObject('/api/v1/findCompetGoods/0', 'medicine', conditions)
				});
				return Promise.all(promiseArray)
			})
			// .then(data => { // 处理竞品
			//     console.log(this.store.peekAll('medicine'));
			//     return null;
			// })
			.then(() => {
				// let req = this.store.createRecord('request', {
				// 	res: 'bind_course_goods',
				// 	fmcond: this.store.createRecord('fmcond', {
				// 		skip: 0,
				// 		take: 20
				// 	})
				// });
				//
				// let eqValues = [{ type: 'eqcond', key: 'course_id', val: ids.courseid }]
				//
				// let conditions = _conditions(req, eqValues);
				let medicines = this.store.peekAll('medicine');
				console.log(medicines);
				let promiseArray = medicines.map(elem => {
					let req = this.store.createRecord('request', {
						res: 'bind_course_region_goods_ym_sales',
						fmcond: this.store.createRecord('fmcond', {
							skip: 0,
							take: 1000
						})
					});

					let eqValues = [
						{ type: 'eqcond', key: 'course_id', val: paramsController.courseid },
						{ type: 'eqcond', key: 'goods_id', val: elem.id },
						{ type: 'gtecond', key: 'ym', val: '17-01' },
						{ type: 'ltecond', key: 'ym', val: '18-03' }
					]

					eqValues.forEach(elem => {
						req.get(elem.type).pushObject(this.store.createRecord(elem.type, { key: elem.key, val: elem.val }))
					});
					let conditions = this.store.object2JsonApi('request', req);
					return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
				});
				return Promise.all(promiseArray)
			})
			.then((data) => {
				console.log(data)
				data.forEach(elem => { elem.forEach(good => temp.pushObject(good)) });
				let predictionData = temp.filter(elem => elem.ym === '18-01' || elem.ym === '18-02' || elem.ym === '18-03')
				let predictionGroupData = groupBy(predictionData, 'region_id')
				let regionCompanyTargets = Object.keys(predictionGroupData).map(key => {
					return {
						region_id: key,
						company_targe: predictionGroupData[key].reduce((acc, cur) => acc + cur.sales.company_target, 0)
					}
				})
				controller.set('regionCompanyTargets', regionCompanyTargets)
				controller.set('totalCompanyTarget', predictionData.reduce((acc, cur) => acc + cur.sales.company_target, 0))

				let areaBarData = d3Data(groupBy(temp.filter(elem => elem.region_id !== 'all'), 'region_id'));
				controller.set('areaBarData', areaBarData);
				controller.set('barData', areaBarData.find(elem => elem.region_id === controller.get('initSelectedRegionId')).data)

				return areaBarData
			})


		// return Promise.all(promiseArray).then(data => {
		// 	console.log(data)
		// 	data.forEach(elem => { elem.forEach(good => temp.pushObject(good)) });
		// 	let predictionData = temp.filter(elem => elem.ym === '18-01' || elem.ym === '18-02' || elem.ym === '18-03')
		// 	let predictionGroupData = groupBy(predictionData, 'region_id')
		// 	let regionCompanyTargets = Object.keys(predictionGroupData).map(key => {
		// 		return {
		// 			region_id: key,
		// 			company_targe: predictionGroupData[key].reduce((acc, cur) => acc + cur.sales.company_target, 0)
		// 		}
		// 	})
		// 	controller.set('regionCompanyTargets', regionCompanyTargets)
		// 	controller.set('totalCompanyTarget', predictionData.reduce((acc, cur) => acc + cur.sales.company_target, 0))
		//
		// 	let areaBarData = d3Data(groupBy(temp.filter(elem => elem.region_id !== 'all'), 'region_id'));
		// 	controller.set('areaBarData', areaBarData);
		// 	controller.set('barData', areaBarData.find(elem => elem.region_id === controller.get('initSelectedRegionId')).data)
		//
		// 	return areaBarData
		// })
	},
	model() {
		let ids = this.modelFor('new-project.project-start');
		let paramsController = this.modelFor('new-project.project-start');
		let controller = this.controllerFor('new-project.project-start.index.objective')
		let region = this.store.peekAll('region')

		controller.set('params', paramsController);
		controller.set('regionData', region);
		controller.set('initSelectedRegionId', region.firstObject.id);

		return this.loadD3Data(paramsController, controller, ids)

	},
	activate() {
		this.controllerFor('new-project.project-start.index.objective').set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
		// this.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
	},
});