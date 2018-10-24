import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';

export default Route.extend({
	loadD3Data(ids) {

		let req = this.store.createRecord('request', { res: 'bind_course_region_radar' });
		req.get('eqcond').pushObject(this.store.createRecord('eqcond', {
			key: 'course_id',
			val: ids.courseid,
		}))
		let conditions = this.store.object2JsonApi('request', req);

		return this.store.queryMultipleObject('/api/v1/findRadarFigure/0', 'bind_course_region_radar', conditions)
			.then((data) => {
				let radarCache = this.store.peekAll('bind_course_region_radar');

				let radarArray = radarCache.filter(elem => elem.region_id !== 'ave');
				let ave = radarCache.find(elem => elem.region_id === 'ave');

				function axes(radarfigure) {
					let axes = [];
					axes.push({
						axis: '产品知识',
						value: radarfigure.prod_knowledge_val
					})

					axes.push({
						axis: '目标拜访频次',
						value: radarfigure.target_call_freq_val
					})

					axes.push({
						axis: '拜访次数',
						value: radarfigure.call_times_val
					})

					axes.push({
						axis: '实际工作天数',
						value: radarfigure.in_field_days_val
					})

					axes.push({
						axis: '工作积极性',
						value: radarfigure.motivation_val
					})

					axes.push({
						axis: '区域管理能力',
						value: radarfigure.territory_manage_val
					})

					axes.push({
						axis: '销售能力',
						value: radarfigure.sales_skills_val
					})
					return axes
				}
				return radarArray.map(elem => {
					let regionCache = this.store.peekRecord('region', elem.region_id);
					return {
						region_id: elem.region_id,
						data: [{
								name: '区域平均',
								axes: axes(ave.radarfigure),
								color: '#762712'
							},
							{
								name: regionCache.name,
								axes: axes(elem.radarfigure),
								color: '#26AF32'
							}
						]
					}
				});
			})
		/*
        let radarCache = this.store.peekAll('bind_course_region_radar');
		let radarArray = radarCache.filter(elem => elem.region_id !== 'ave');
		let ave = radarCache.find(elem => elem.region_id === 'ave');

		function axes(radarfigure) {
			let axes = [];
			axes.push({
				axis: '产品知识',
				value: radarfigure.prod_knowledge_val
			})

			axes.push({
				axis: '目标拜访频次',
				value: radarfigure.target_call_freq_val
			})

			axes.push({
				axis: '拜访次数',
				value: radarfigure.call_times_val
			})

			axes.push({
				axis: '实际工作天数',
				value: radarfigure.in_field_days_val
			})

			axes.push({
				axis: '工作积极性',
				value: radarfigure.motivation_val
			})

			axes.push({
				axis: '区域管理能力',
				value: radarfigure.territory_manage_val
			})

			axes.push({
				axis: '销售能力',
				value: radarfigure.sales_skills_val
			})
			return axes
		}

		return radarArray.map(elem => {
			let regionCache = this.store.peekRecord('region', elem.region_id);
			return {
				region_id: elem.region_id,
				data: [{
						name: '区域平均',
						axes: axes(ave.radarfigure),
						color: '#762712'
					},
					{
						name: regionCache.name,
						axes: axes(elem.radarfigure),
						color: '#26AF32'
					}
				]
			}
		});*/
	},

	model() {
		let ids = this.modelFor('new-project.project-start');
		let paramsController = this.modelFor('new-project.project-start');
		let controller = this.controllerFor('new-project.project-start.index.action-plan')
		let regionCache = this.store.peekAll('region');

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
		let medicines = [];

		/**
		 * 备注：Promise的链式调用，未做catch处理
		 */
		return this.store.queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions)
			.then(data => { // 处理公司产品
				data.forEach(elem => {
					elem.set('compete', false),
						medicines.pushObject(elem)

				});
				return data;
			})
			// .then(data => { // 获取公司的竞品
			// 	let that = this;
			// 	let promiseArray = data.map(reval => {
			// 		let req = that.store.createRecord('request', {
			// 			res: 'bind_course_goods_compet',
			// 			fmcond: that.store.createRecord('fmcond', {
			// 				skip: 0,
			// 				take: 20
			// 			})
			// 		});
			// 		let eqValues = [
			// 			{ type: 'eqcond', key: 'course_id', val: ids.courseid },
			// 			{ type: 'eqcond', key: 'goods_id', val: reval.id },
			// 		]
			// 		let conditions = _conditions(req, eqValues);
			// 		return that.store.queryMultipleObject('/api/v1/findCompetGoods/0', 'medicine', conditions)
			// 	});
			// 	return Promise.all(promiseArray)
			// })
			// .then(data => { // 处理竞品
			// 	data.forEach(reVal => {
			// 		reVal.forEach(elem => {
			// 			medicines.pushObject(elem)
			// 		})
			// 	})
			// 	return medicines;
			// })
			.then(data => { // 获取折线图数据

				let req = this.store.createRecord('request', {
					res: 'bind_course_region_goods_ym_sales',
					fmcond: this.store.createRecord('fmcond', {
						skip: 0,
						take: 1000
					})
				});
				// let promiseArray = data.map(elem => {
				let eqValues = [
					{ type: 'eqcond', key: 'course_id', val: ids.courseid },
					{ type: 'eqcond', key: 'goods_id', val: data.firstObject.id },
					{ type: 'gtecond', key: 'ym', val: '18-01' },
					{ type: 'ltecond', key: 'ym', val: '18-03' },
				]
				let conditions = _conditions(req, eqValues)
				return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
				// });
				// return Promise.all(promiseArray)
			})

			.then((data) => { // 处理bind-course-region-goods-ym-sales
				let temp = [];
				// data.forEach(elem => { elem.forEach(good => temp.pushObject(good)) });
				data.forEach(elem => { temp.pushObject(elem) });

				let predictionData = temp.filter(elem => elem.ym === '18-01' || elem.ym === '18-02' || elem.ym === '18-03')
				let predictionGroupData = groupBy(predictionData, 'region_id')
				let regionCompanyTargets = Object.keys(predictionGroupData).map(key => {
					return {
						region_id: key,
						company_targe: predictionGroupData[key].reduce((acc, cur) => acc + cur.sales.company_target, 0)
					}
				})

				// let goodsByRegion = groupBy(this.store.peekAll('bind-course-region-goods-ym-sales').filter(elem => elem.region_id !== 'all'), 'region_id')
				// let regionCompanyTargets = Object.keys(goodsByRegion).map(key => {
				// 	return {
				// 		region_id: key,
				// 		company_targe: goodsByRegion[key].lastObject.sales.company_target
				// 	}
				// })
				controller.set('regionCompanyTargets', regionCompanyTargets)

				return null;
			})
			// 获取行动计划列表内容
			.then(() => {
				let req = this.store.createRecord('request', {
					res: 'bind_course_action_plan',
				});

				let eqValues = [{ type: 'eqcond', key: 'course_id', val: ids.courseid }];
				let conditions = _conditions(req, eqValues)
				return this.store.queryMultipleObject('/api/v1/actionPlanLst/0', 'actionplan', conditions)
			})
			.then((data) => { // 处理行动计划内容
				let readyChoose = data.map((item) => {
					return {
						id: item.id,
						text: item.content,
						isChecked: false,
					}
				})
				controller.set('readyChoose', readyChoose);
				return null;
			})
			.then(() => { // 获取所有代表
				let promiseArray = regionCache.map(elem => {
					req = this.store.createRecord('request', { res: 'bind_course_region_rep' });
					let eqValues = [
						{ type: 'eqcond', key: 'region_id', val: elem.id },
						{ type: 'eqcond', key: 'course_id', val: ids.courseid },
					]
					eqValues.forEach((elem) => {
						req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
							key: elem.key,
							val: elem.val,
						}))
					});
					conditions = this.store.object2JsonApi('request', req);
					return this.store.queryMultipleObject('/api/v1/findRegionRep/0', 'representative', conditions)
				});
				return Promise.all(promiseArray)
			})
			.then((data) => { // 处理所有代表
				let represents = [];
				data.forEach((elem, index) => {
					// 绑定区域与人员关系，方便缓存读取
					represents.pushObject({
						region_id: elem.query.included[0].attributes.val,
						data: [elem.firstObject.rep_name],
					})
				})
				controller.set('areaReps', represents);

				return this.loadD3Data(ids)
			})
			.then((res) => {
				controller.set('params', paramsController);
				controller.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));

				controller.set('radarData', res.find(elem => elem.region_id === regionCache.firstObject.id).data);
				controller.set('areaRadars', res);
				return regionCache;
			})





		// let bind_course_region_repCache = this.store.peekAll('bind_course_region_rep')
		// let representsCache = this.store.peekAll('representative');
		// let goodsByRegion = groupBy(this.store.peekAll('bind-course-region-goods-ym-sales').filter(elem => elem.region_id !== 'all'), 'region_id')
		// let areaReps = bind_course_region_repCache.map(elem => {
		// 	return {
		// 		region_id: elem.region_id,
		// 		data: elem.represents.map(ele => representsCache.find(x => x.id === ele).rep_name)
		// 	}
		// })
		// let regionCompanyTargets = Object.keys(goodsByRegion).map(key => {
		// 	return {
		// 		region_id: key,
		// 		company_targe: goodsByRegion[key].lastObject.sales.company_target
		// 	}
		// })
		// controller.set('areaReps', areaReps)
		// controller.set('regionCompanyTargets', regionCompanyTargets)

		// let d3Data = this.loadD3Data(ids);
		// controller.set('params', paramsController);
		// controller.set('radarData', d3Data.find(elem => elem.region_id === regionCache.firstObject.id).data);
		// controller.set('areaRadars', d3Data);
		// controller.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
		// this.loadD3Data(ids).then((res) => {
		// 	controller.set('radarData', res.find(elem => elem.region_id === regionCache.firstObject.id).data);
		// 	controller.set('areaRadars', res);
		// })

		// return regionCache;
	},
	actions: {

	}
});