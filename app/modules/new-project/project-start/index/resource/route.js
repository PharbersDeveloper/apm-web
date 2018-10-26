import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';

export default Route.extend({
	loadTableTarget(paramsController) {
		let temp = [];
		let medicines = this.store.peekAll('medicine');
		let companyProd = medicines.find((item) => {
			return !item.compete;
		});
		// let promiseArray = medicines.map(elem => {
		let req = this.store.createRecord('request', {
			res: 'bind_course_region_goods_ym_sales',
			fmcond: this.store.createRecord('fmcond', {
				skip: 0,
				take: 1000
			})
		});

		let eqValues = [
			{ type: 'eqcond', key: 'course_id', val: paramsController.courseid },
			{ type: 'eqcond', key: 'goods_id', val: companyProd.id },
			{ type: 'gtecond', key: 'ym', val: '18-01' },
			{ type: 'ltecond', key: 'ym', val: '18-03' }
		]

		eqValues.forEach(elem => {
			req.get(elem.type).pushObject(this.store.createRecord(elem.type, { key: elem.key, val: elem.val }))
		});
		let conditions = this.store.object2JsonApi('request', req);
		return this.store.queryMultipleObject('/api/v1/findAllMedSales/0', 'bind_course_region_goods_ym_sales', conditions)

			// return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
			// });
			// return Promise.all(promiseArray)
			.then(data => {
				// data.forEach(elem => { elem.forEach(good => temp.pushObject(good)) });
				data.forEach(elem => { temp.pushObject(elem) });

				let predictionData = temp.filter(elem => elem.ym === '18-01' || elem.ym === '18-02' || elem.ym === '18-03')
				let predictionGroupData = groupBy(predictionData, 'region_id')
				let regionCompanyTargets = Object.keys(predictionGroupData).map(key => {
					return {
						region_id: key,
						company_targe: predictionGroupData[key].reduce((acc, cur) => acc + cur.sales.company_target, 0)
					}
				});
				return regionCompanyTargets
			})
	},
	model() {
		let paramsController = this.modelFor('new-project.project-start');
		let controller = this.controllerFor('new-project.project-start.index.resource')
		controller.set('params', paramsController);

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

		let eqValues = [{ type: 'eqcond', key: 'course_id', val: paramsController.courseid }]

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
				let promiseArray = data.map(reval => {
					let req = that.store.createRecord('request', {
						res: 'bind_course_goods_compet',
						fmcond: that.store.createRecord('fmcond', {
							skip: 0,
							take: 20
						})
					});
					let eqValues = [
						{ type: 'eqcond', key: 'course_id', val: paramsController.courseid },
						{ type: 'eqcond', key: 'goods_id', val: reval.id },
					]
					let conditions = _conditions(req, eqValues);
					return that.store.queryMultipleObject('/api/v1/findCompetGoods/0', 'medicine', conditions)
				});
				return Promise.all(promiseArray)
			})
			.then((data) => {
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
				return this.store.queryObject('/api/v1/findExamRequire/0', 'examrequire', conditions)
			})
			.then((data) => {
				controller.set('allotData', data)
				return null;
			})
			.then(() => {
				return this.loadTableTarget(paramsController)
			})




		// let req = this.store.createRecord('request', { res: 'bind_course_exam_require' });
		//
		// let eqValues = [
		// 	{ type: 'eqcond', key: 'course_id', val: paramsController.courseid },
		// ]
		//
		// eqValues.forEach((elem, index) => {
		// 	req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
		// 		key: elem.key,
		// 		val: elem.val,
		// 	}))
		// });
		// let conditions = this.store.object2JsonApi('request', req);
		// this.store.queryObject('/api/v1/findExamRequire/0', 'examrequire', conditions)
		// 	.then(data => {
		// 		controller.set('allotData', data)
		// 		return null;
		// 	})
		// 	.then(() => {})
		//
		// return this.loadTableTarget(paramsController)
	},
	actions: {

	}
});