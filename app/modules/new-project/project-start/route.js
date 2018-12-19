import Route from '@ember/routing/route';
import { groupBy } from '../../phtool/tool';
import rsvp from 'rsvp';

export default Route.extend({
	scenarioInfo(courseid, controller) {
		let courseRecord = this.store.peekRecord('course', courseid),
			data = {
				content: courseRecord.get('describe'),
				image: localStorage.getItem('userImage')
			};

		controller.set('ScenarioModel', data);
	},

	productInfo(ids, controller) {

		function queryCondition(request, anyConditions) {
			anyConditions.forEach((elem) => {
				request.get(elem.type).pushObject(request.store.createRecord(elem.type, {
					id: elem.id,
					key: elem.key,
					val: elem.val
				}));
			});
			return request.store.object2JsonApi(request);
		}

		let req = this.store.createRecord('request', {
				id: '0',
				res: 'bind_course_goods',
				fmcond: this.store.createRecord('fmcond', {
					id: 'fm0',
					skip: 0,
					take: 20
				})
			}),
			eqValues = [{ id: '1', type: 'eqcond', key: 'course_id', val: ids.courseid }],
			conditions = queryCondition(req, eqValues),
			medicines = [],
			lineData = [];

		/**
		 * 备注：Promise的链式调用，未做catch处理
		 */
		return this.store.queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions)
			.then(data => { // 处理公司产品
				data.forEach(elem => {
					elem.set('compete', false);
					medicines.pushObject(elem);
				});
				return data;
			})
			.then(data => { // 获取公司的竞品
				let that = this,
					promiseArray = data.map(reval => {
						let reqInside = that.store.createRecord('request', {
								id: '0',
								res: 'bind_course_goods_compet',
								fmcond: that.store.createRecord('fmcond', {
									id: 'fm01',
									skip: 0,
									take: 20
								})
							}),
							eqValuesInside = [
								{ id: '1', type: 'eqcond', key: 'course_id', val: ids.courseid },
								{ id: '2', type: 'eqcond', key: 'goods_id', val: reval.id }
							],
							conditionsInside = queryCondition(reqInside, eqValuesInside);

						return that.store.queryMultipleObject('/api/v1/findCompetGoods/0', 'medicine', conditionsInside);
					});

				return rsvp.Promise.all(promiseArray);
			})
			.then(data => { // 处理竞品
				data.forEach(reVal => {
					reVal.forEach(elem => {
						medicines.pushObject(elem);
					});
				});
				return medicines;
			})
			.then(data => { // 获取折线图数据
				let req = this.store.createRecord('request', {
					id: '0',
					res: 'bind_course_region_goods_ym_sales',
					fmcond: this.store.createRecord('fmcond', {
						id: 'fm02',
						skip: 0,
						take: 1000
					})
				});
				let promiseArray = data.map(elem => {
					let eqValues = [
						{ id: '1', type: 'eqcond', key: 'course_id', val: ids.courseid },
						{ id: '2', type: 'eqcond', key: 'goods_id', val: elem.id },
						{ id: '3', type: 'gtecond', key: 'ym', val: '17-01' },
						{ id: '4', type: 'ltecond', key: 'ym', val: '17-12' }
					];
					let conditions = queryCondition(req, eqValues);

					return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions);
				});

				return rsvp.Promise.all(promiseArray);
			})
			.then(data => { // 处理折线图数据
				/**
				 * 没直接取上一个数据，是因为还需要做很多麻烦处理，执行到这一步就表明bind_course_region_goods_ym_sales这个model里面已经有值了
				 * 既然只读取一次，何不全部读取出来
				 */
				this.get('logger').log(data);

				let that = this,
					medicineList = [],
					medicineAll = null;

				function d3Data(medicineArrayObject) {
					Object.keys(medicineArrayObject).forEach(key => {
						let temp = groupBy(medicineArrayObject[key], 'ym'),
							record = that.store.peekRecord('medicine', key),
							values = Object.keys(temp).map(elem => {
								let sum = temp[elem].reduce((acc, cur) => acc + cur.sales.share, 0);

								return {
									ym: elem,
									value: sum
								};
							});

						lineData.pushObject({
							name: record.corp_name,
							values
						});
					});
				}
				medicineList = this.store.peekAll('bind_course_region_goods_ym_sales');

				medicineAll = groupBy(medicineList.filter(elem => elem.region_id === 'all'), 'goods_id');
				d3Data(medicineAll);
				// TODO 获取竞品后立即获取 区域信息，放到最后获取会出现缓存问题，这块需要重构
				return this.areaInfo(ids, controller);
			})
			.finally(() => {
				let productInfo = {
					medicines,
					lineData
				};

				controller.set('ProductModel', productInfo);
			});
	},
	model(ids) {
		let projectController = this.controllerFor('new-project.project-start');

		projectController.set('ids', ids);
		// 场景介绍
		this.scenarioInfo(ids.courseid, projectController);
		return ids;
	}
});
