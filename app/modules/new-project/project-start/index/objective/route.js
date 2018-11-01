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
					id: elem.id,
					key: elem.key,
					val: elem.val,
				}))
			});
			return request.store.object2JsonApi(request);
		}
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

		let conditions = _conditions(req, eqValues);

		return this.get('pmController').get('Store')
			.queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions)
			.then(data => { // 处理公司产品 并获取公司产品销售数据
				data.forEach(elem => {
					elem.set('compete', false)
				});
				let req = this.get('pmController').get('Store').createModel('request', {
					id: 'objectiveCompete0',
					res: 'bind_course_region_goods_ym_sales',
					fmcond: this.get('pmController').get('Store').createModel('fmcond', {
						id: 'objectiveCompeteFm1',
						skip: 0,
						take: 1000
					})
				});

				let eqValues = [
					{ id: 'objectiveCompete1', type: 'eqcond', key: 'course_id', val: paramsController.courseid },
					{ id: 'objectiveCompete2', type: 'eqcond', key: 'goods_id', val: data.firstObject.id },
					{ id: 'objectiveCompete3', type: 'gtecond', key: 'ym', val: '17-01' },
					{ id: 'objectiveCompet4', type: 'ltecond', key: 'ym', val: '18-03' }
				]

				eqValues.forEach(elem => {
					req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, { id: elem.id, key: elem.key, val: elem.val }))
				});
				let conditions = this.get('pmController').get('Store').object2JsonApi(req);
				// return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
				return this.get('pmController').get('Store')
					.queryMultipleObject('/api/v1/findAllMedSales/0', 'bind_course_region_goods_ym_sales', conditions);
			})
			/*
				.then(data => { // 获取公司的竞品
					let that = this;
					let companyProd = this.get('pmController').get('Store').peekAll('medicine').filter((item) => {
						return !item.compete;
					});

					let promiseArray = companyProd.map(reval => {
						let req = that.store.createRecord('request', {
							res: 'bind_course_goods_compet',
							fmcond: that.store.createRecord('fmcond', {
								skip: 0,
								take: 20
							})
						});
						let eqValues = [
							{ type: 'eqcond', key: 'course_id', val: ids.courseid },
							{ type: 'eqcond', key: 'goods_id', val: reval.id },
						]
						let conditions = _conditions(req, eqValues);
						return that.store.queryMultipleObject('/api/v1/findCompetGoods/0', 'medicine', conditions)
					});
					return Promise.all(promiseArray)
				})
				.then(data => { // 获取竞品的销售数据(firstObject);
					let competeMed = this.get('pmController').get('Store').peekAll('medicine').filter((item) => {
						return item.compete;
					});
					let req = this.get('pmController').get('Store').createModel('request', {
						res: 'bind_course_region_goods_ym_sales',
						fmcond: this.get('pmController').get('Store').createModel('fmcond', {
							skip: 0,
							take: 1000
						})
					});

					let eqValues = [
						{ type: 'eqcond', key: 'course_id', val: paramsController.courseid },
						{ type: 'eqcond', key: 'goods_id', val: competeMed.firstObject.id },
						{ type: 'gtecond', key: 'ym', val: '17-01' },
						{ type: 'ltecond', key: 'ym', val: '18-03' }
					]

					eqValues.forEach(elem => {
						req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, { key: elem.key, val: elem.val }))
					});
					let conditions = this.get('pmController').get('Store').object2JsonApi( req);
					return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
					// let promiseArray = data.firstObject.map(elem => {
					// 	let req = this.get('pmController').get('Store').createModel('request', {
					// 		res: 'bind_course_region_goods_ym_sales',
					// 		fmcond: this.get('pmController').get('Store').createModel('fmcond', {
					// 			skip: 0,
					// 			take: 1000
					// 		})
					// 	});
					//
					// 	let eqValues = [
					// 		{ type: 'eqcond', key: 'course_id', val: paramsController.courseid },
					// 		{ type: 'eqcond', key: 'goods_id', val: elem.id },
					// 		{ type: 'gtecond', key: 'ym', val: '17-01' },
					// 		{ type: 'ltecond', key: 'ym', val: '18-03' }
					// 	]
					//
					// 	eqValues.forEach(elem => {
					// 		req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, { key: elem.key, val: elem.val }))
					// 	});
					// 	let conditions = this.get('pmController').get('Store').object2JsonApi( req);
					// 	return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
					// });
					// return Promise.all(promiseArray);
				})
				.then((data) => { // 获取竞品的销售数据(secondObject);
					let competeMed = this.get('pmController').get('Store').peekAll('medicine').filter((item) => {
						return item.compete;
					});
					let req = this.get('pmController').get('Store').createModel('request', {
						res: 'bind_course_region_goods_ym_sales',
						fmcond: this.get('pmController').get('Store').createModel('fmcond', {
							skip: 0,
							take: 1000
						})
					});

					let eqValues = [
						{ type: 'eqcond', key: 'course_id', val: paramsController.courseid },
						{ type: 'eqcond', key: 'goods_id', val: competeMed[1].id },
						{ type: 'gtecond', key: 'ym', val: '17-01' },
						{ type: 'ltecond', key: 'ym', val: '18-03' }
					]

					eqValues.forEach(elem => {
						req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, { key: elem.key, val: elem.val }))
					});
					let conditions = this.get('pmController').get('Store').object2JsonApi( req);
					return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)

				})
				.then((data) => { // 获取竞品的销售数据(thirdObject);
					let competeMed = this.get('pmController').get('Store').peekAll('medicine').filter((item) => {
						return item.compete;
					});
					let req = this.get('pmController').get('Store').createModel('request', {
						res: 'bind_course_region_goods_ym_sales',
						fmcond: this.get('pmController').get('Store').createModel('fmcond', {
							skip: 0,
							take: 1000
						})
					});

					let eqValues = [
						{ type: 'eqcond', key: 'course_id', val: paramsController.courseid },
						{ type: 'eqcond', key: 'goods_id', val: competeMed.lastObject.id },
						{ type: 'gtecond', key: 'ym', val: '17-01' },
						{ type: 'ltecond', key: 'ym', val: '18-03' }
					]

					eqValues.forEach(elem => {
						req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, { key: elem.key, val: elem.val }))
					});
					let conditions = this.get('pmController').get('Store').object2JsonApi( req);
					return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
				})
			*/
			// .then((data) => {
			// 	let medicines = this.get('pmController').get('Store').peekAll('medicine');
			// 	let promiseArray = medicines.map(elem => {
			// 		let req = this.get('pmController').get('Store').createModel('request', {
			// 			res: 'bind_course_region_goods_ym_sales',
			// 			fmcond: this.get('pmController').get('Store').createModel('fmcond', {
			// 				skip: 0,
			// 				take: 1000
			// 			})
			// 		});
			//
			// 		let eqValues = [
			// 			{ type: 'eqcond', key: 'course_id', val: paramsController.courseid },
			// 			{ type: 'eqcond', key: 'goods_id', val: elem.id },
			// 			{ type: 'gtecond', key: 'ym', val: '17-01' },
			// 			{ type: 'ltecond', key: 'ym', val: '18-03' }
			// 		]
			//
			// 		eqValues.forEach(elem => {
			// 			req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, { key: elem.key, val: elem.val }))
			// 		});
			// 		let conditions = this.get('pmController').get('Store').object2JsonApi( req);
			// 		return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
			// 	});
			// 	return Promise.all(promiseArray)
			// })
			.then((data) => {
				// let TotalMeds = this.get('pmController').get('Store').peekAll('bind_course_region_goods_ym_sales');
				// data.forEach(elem => { elem.forEach(good => temp.pushObject(good)) });
				// data.forEach(elem => { temp.pushObject(elem) });
				let contTemp =[];
				data.forEach((elem) => {
					if (elem.ym.indexOf('q') < 0) {
						temp.pushObject(elem)
					} else {
						contTemp.pushObject(elem)
					}
				});

				let predictionData = temp.filter(elem => elem.ym === '18-01' || elem.ym === '18-02' || elem.ym === '18-03')
				let predictionGroupData = groupBy(predictionData, 'region_id')
				let regionCompanyTargets = Object.keys(predictionGroupData).map(key => {
					return {
						region_id: key,
						company_targe: predictionGroupData[key].reduce((acc, cur) => acc + cur.sales.company_target, 0)
					}
				})
				// sales_contri x销售贡献度
				let _predictionDataForContri = contTemp.filter(elem => elem.ym === '17-q4');
				let _predictionGroupDataForContri = groupBy(_predictionDataForContri, 'region_id');
				let regionSalesContri = Object.keys(_predictionGroupDataForContri).map(key => {
					return {
						region_id: key,
						sales_contri: _predictionGroupDataForContri[key].reduce((acc, cur) => acc + cur.sales.sales_contri, 0)
					}
				});
				controller.set('regionSalesContri', regionSalesContri);
				controller.set('regionCompanyTargets', regionCompanyTargets);
				controller.set('totalCompanyTarget', predictionData.reduce((acc, cur) => acc + cur.sales.company_target, 0))

				let areaBarData = d3Data(groupBy(temp.filter(elem => elem.region_id !== 'all'), 'region_id'));
				areaBarData.forEach((item) => {
					item.data.sort((a, b) => {
						return (a.key.slice(0, 2) + a.key.slice(3)) - (b.key.slice(0, 2) + b.key.slice(3))
					})
				})
				controller.set('areaBarData', areaBarData);
				controller.set('barData', areaBarData.find(elem => elem.region_id === controller.get('initSelectedRegionId')).data)

				return areaBarData;
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
			.then((data) => {
				return this.loadD3Data(paramsController, controller, ids);
			})

	},
	activate() {
		this.controllerFor('new-project.project-start.index.objective').set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
		// this.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
	},
});
