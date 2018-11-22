import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';
import { inject } from '@ember/service';
import rsvp from 'rsvp';

export default Route.extend({
	i18n: inject(),
	loadD3Data(ids) {
		let that = this;
		let req = this.get('pmController').get('Store').createModel('request', {
			id: 'action0',
			res: 'bind_course_region_radar'
		});
		req.get('eqcond').pushObject(this.get('pmController').get('Store').createModel('eqcond', {
			id: 'action1',
			key: 'course_id',
			val: ids.courseid,
		}))
		let conditions = this.get('pmController').get('Store').object2JsonApi(req);

		return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findRadarFigure/0', 'bind_course_region_radar', conditions)
			.then((data) => {
				let radarCache = this.get('pmController').get('Store').peekAll('bind_course_region_radar');

				let radarArray = radarCache.filter(elem => elem.get('region_id') !== 'ave');
				let ave = radarCache.find(elem => elem.get('region_id') === 'ave');


				function axes(radarfigure) {
					let axes = [];
					axes.push({
						axis: that.get('i18n').t('apm.component.radar.prodKnowledge') + "",
						value: radarfigure.get('prod_knowledge_val')
					})

					axes.push({
						axis: that.get('i18n').t('apm.component.radar.targetVisit') + "",
						value: radarfigure.get('target_call_freq_val')
					})

					axes.push({
						axis: that.get('i18n').t('apm.component.radar.visitTime') + "",
						value: radarfigure.get('target_occupation_val')
					})

					axes.push({
						axis: that.get('i18n').t('apm.component.radar.localWorkDay') + "",
						value: radarfigure.get('in_field_days_val')
					})

					axes.push({
						axis: that.get('i18n').t('apm.component.radar.workEnthusiasm') + "",
						value: radarfigure.get('motivation_val')
					})

					axes.push({
						axis: that.get('i18n').t('apm.component.radar.areaManageAbility') + "",
						value: radarfigure.get('territory_manage_val')
					})

					axes.push({
						axis: that.get('i18n').t('apm.component.radar.saleAbility') + "",
						value: radarfigure.get('sales_skills_val')
					})
					return axes
				}

				return radarArray.map(elem => {
					let regionCache = this.get('pmController').get('Store').peekRecord('region', elem.get('region_id'));
					return {
						region_id: elem.get('region_id'),
						data: [{
								name: that.get('i18n').t('apm.component.radar.areaAvg') + "",
								axes: axes(ave.get('radarfigure')),
								color: '#762712'
							},
							{
								name: regionCache.get('name'),
								axes: axes(elem.get('radarfigure')),
								color: '#26AF32'
							}
						]
					}
				});
			})
	},

	model() {
		let ids = this.modelFor('new-project.project-start');
		let paramsController = this.modelFor('new-project.project-start');
		let controller = this.controllerFor('new-project.project-start.index.action-plan')
		let regionCache = this.get('pmController').get('Store').peekAll('region');

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
			id: 'action2',
			res: 'bind_course_goods',
			fmcond: this.get('pmController').get('Store').createModel('fmcond', {
				id: 'actionFm0',
				skip: 0,
				take: 20
			})
		});

		let eqValues = [{ id: 'action3', type: 'eqcond', key: 'course_id', val: ids.courseid }]

		let conditions = _conditions(req, eqValues);
		let medicines = [];

		/**
		 * 备注：Promise的链式调用，未做catch处理
		 */
		return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions)
			.then(data => { // 处理公司产品
				data.forEach(elem => {
					elem.set('compete', false),
						medicines.pushObject(elem)
				});
				return data;
			})
			.then(data => { // 获取折线图数据

				let req = this.get('pmController').get('Store').createModel('request', {
					id: 'actionLine0',
					res: 'bind_course_region_goods_time_unit',
					fmcond: this.get('pmController').get('Store').createModel('fmcond', {
						id: 'actionLineFm0',
						skip: 0,
						take: 1000
					})
				});
				let eqValues = [
					{ id: 'actionLine5', type: 'eqcond', key: 'time_type', val: 'month' },
					{ id: 'actionLine1', type: 'eqcond', key: 'course_id', val: ids.courseid },
					{ id: 'actionLine2', type: 'eqcond', key: 'goods_id', val: data.get('firstObject.id') },
					{ id: 'actionLine3', type: 'gtecond', key: 'time', val: '18-01' },
					{ id: 'actionLine4', type: 'ltecond', key: 'time', val: '18-03' },
				]
				let conditions = _conditions(req, eqValues)
				return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findAllMedUnit/0', 'bind_course_region_goods_time_unit', conditions)
			})
			.then((data) => { // 处理bind-course-region-goods-time-unit
				let temp = [];
				data.forEach(elem => { temp.pushObject(elem) });

				let predictionData = temp.filter(elem => elem.get('time') === '18-01' || elem.get('time') === '18-02' || elem.get('time') === '18-03')
				let predictionGroupData = groupBy(predictionData, 'region_id')
				let regionCompanyTargets = Object.keys(predictionGroupData).map(key => {
					return {
						region_id: key,
						company_targe: predictionGroupData[key].reduce((acc, cur) => acc + cur.get('unit.company_target'), 0)
					}
				})

				controller.set('regionCompanyTargets', regionCompanyTargets)
				return null;
			})
			// 获取行动计划列表内容
			.then(() => {
				let req = this.get('pmController').get('Store').createModel('request', {
					id: 'actionList0',
					res: 'bind_course_action_plan',
				});

				let eqValues = [{ id: 'actionList1', type: 'eqcond', key: 'course_id', val: ids.courseid }];
				let conditions = _conditions(req, eqValues)
				return this.get('pmController').get('Store').queryMultipleObject('/api/v1/actionPlanLst/0', 'actionplan', conditions)
			})
			.then((data) => { // 处理行动计划内容
				let readyChoose = data.map((item) => {
					return {
						id: item.get('id'),
						text: item.get('content'),
						isChecked: false,
					}
				})
				controller.set('readyChoose', readyChoose);
				return null;
			})
			.then(() => { // 获取所有代表
				let promiseArray = regionCache.map(elem => {
					req = this.get('pmController').get('Store').createModel('request', {
						id: elem.get('id') + 'actionRep0',
						res: 'bind_course_region_rep'
					});
					let eqValues = [
						{ id: elem.id + 'actionRep1', type: 'eqcond', key: 'region_id', val: elem.get('id') },
						{ id: elem.id + 'actionRep2', type: 'eqcond', key: 'course_id', val: ids.courseid },
					]
					eqValues.forEach((elem) => {
						req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, {
							id: elem.id,
							key: elem.key,
							val: elem.val,
						}))
					});
					conditions = this.get('pmController').get('Store').object2JsonApi(req);
					return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findRegionRep/0', 'representative', conditions)
				});
				return rsvp.Promise.all(promiseArray)
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

				controller.set('radarData', res.find(elem => elem.region_id === regionCache.get('firstObject.id')).data);
				controller.set('areaRadars', res);
				return regionCache;
			})
	},
	actions: {

	}
});
