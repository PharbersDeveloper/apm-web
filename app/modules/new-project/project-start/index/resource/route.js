import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';
import rsvp from 'rsvp';

export default Route.extend({
	loadTableTarget(paramsController) {
		let temp = [];
		let medicines = this.get('pmController').get('Store').peekAll('medicine');
		let companyProd = medicines.find((item) => {
			return !item.get('compete');
		});
		let req = this.get('pmController').get('Store').createModel('request', {
			id: 'resource0',
			res: 'bind_course_region_goods_time_unit',
			fmcond: this.get('pmController').get('Store').createModel('fmcond', {
				id: 'resourceFm0',
				skip: 0,
				take: 1000
			})
		});

		let eqValues = [
			{ id:'resource5', type: 'eqcond', key: 'time_type', val: 'month' },
			{ id: 'resource1', type: 'eqcond', key: 'course_id', val: paramsController.courseid },
			{ id: 'resource2', type: 'eqcond', key: 'goods_id', val: companyProd.get('id') },
			{ id: 'resource3', type: 'gtecond', key: 'time', val: '18-01' },
			{ id: 'resource4', type: 'ltecond', key: 'time', val: '18-03' }
		]

		eqValues.forEach(elem => {
			req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, { id: elem.id, key: elem.key, val: elem.val }))
		});
		let conditions = this.get('pmController').get('Store').object2JsonApi(req);
		return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findAllMedUnit/0', 'bind_course_region_goods_time_unit', conditions)
			.then(data => {
				data.forEach(elem => { temp.pushObject(elem) });
				let predictionData = temp.filter(elem => elem.get('time') === '18-01' || elem.get('time') === '18-02' || elem.get('time') === '18-03')
				let predictionGroupData = groupBy(predictionData, 'region_id')
				let regionCompanyTargets = Object.keys(predictionGroupData).map(key => {
					return {
						region_id: key,
						company_targe: predictionGroupData[key].reduce((acc, cur) => acc + cur.get('unit.company_target'), 0)
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
					id: elem.id,
					key: elem.key,
					val: elem.val,
				}))
			});
			return request.store.object2JsonApi(request);
		}

		let req = this.get('pmController').get('Store').createModel('request', {
			id: 'resourceModel0',
			res: 'bind_course_goods',
			fmcond: this.get('pmController').get('Store').createModel('fmcond', {
				id: 'resourceModelFm0',
				skip: 0,
				take: 20
			})
		});

		let eqValues = [{ id: 'resourceModel1', type: 'eqcond', key: 'course_id', val: paramsController.courseid }]

		let conditions = _conditions(req, eqValues);

		return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions)
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
						id: 'resourceCompete0',
						res: 'bind_course_goods_compet',
						fmcond: that.store.createRecord('fmcond', {
							id: 'resourceCompeteFm0',
							skip: 0,
							take: 20
						})
					});
					let eqValues = [
						{ id: 'resourceCompete1', type: 'eqcond', key: 'course_id', val: paramsController.courseid },
						{ id: 'resourceCompete2', type: 'eqcond', key: 'goods_id', val: reval.get('id') },
					]
					let conditions = _conditions(req, eqValues);
					return that.store.queryMultipleObject('/api/v1/findCompetGoods/0', 'medicine', conditions)
				});
				return rsvp.Promise.all(promiseArray)
			})
			.then((data) => {
				let req = this.get('pmController').get('Store').createModel('request', { id: 'resourceCompete3', res: 'bind_course_exam_require' });

				let eqValues = [
					{ id: 'resourceCompete4', type: 'eqcond', key: 'course_id', val: paramsController.courseid },
				]

				eqValues.forEach((elem, index) => {
					req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, {
						id: elem.id,
						key: elem.key,
						val: elem.val,
					}))
				});
				let conditions = this.get('pmController').get('Store').object2JsonApi(req);
				return this.get('pmController').get('Store').queryObject('/api/v1/findExamRequire/0', 'examrequire', conditions)
			})
			.then((data) => {
				controller.set('allotData', data)
				return null;
			})
			.then(() => {
				return this.loadTableTarget(paramsController)
			})

	},
});
