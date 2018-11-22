import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';

export default Route.extend({
	model() {
		let that = this;
		let ids = this.modelFor('new-project.project-start');
		this.controllerFor('new-project.project-start.index.analyze').set('params', ids);

		function _conditions(request, anyConditions) {
			anyConditions.forEach((elem, index) => {
				request.get(elem.type).pushObject(request.store.createRecord(elem.type, {
					id: elem.id,
					key: elem.key,
					val: elem.val,
				}))
			});
			return request.store.object2JsonApi(request);
		};

		function tableData(arrayObjec) {
			return arrayObjec.map((item) => {
				let potential = item.lastObject.unit.potential.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.potential, 0).toFixed(2);
				let potential_contri = item.lastObject.unit.potential_contri.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.potential_contri, 0).toFixed(2);
				let unit = item.lastObject.unit.unit.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales, 0).toFixed(2);
				let contri = item.lastObject.unit.contri.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales_contri, 0).toFixed(2);
				let contri_index = item.lastObject.unit.contri_index.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.contri_index, 0).toFixed(2);
				let growth = item.lastObject.unit.growth.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales_growth, 0).toFixed(2);
				return {
					name: that.store.peekRecord('region', item.lastObject.region_id).name,
					potential,
					potential_contri,
					unit,
					contri,
					contri_index,
					growth
				}
			})
		};

		// 获取所有区域名称与基本信息
		let req = this.get('pmController').get('Store').createModel('request',
			{ id: '0', res: 'bind_course_region' });
		req.get('eqcond').pushObject(this.get('pmController').get('Store').createModel('eqcond', {
			id: '1',
			key: 'course_id',
			val: ids.courseid,
		}))
		let conditions = this.store.object2JsonApi(req);

		return this.store.queryMultipleObject('/api/v1/regionLst/0', 'region', conditions)
			.then((regions) => {
				return regions;
			})
			.then((regions) => {
				let promiseArray = regions.map(elem => {
					req = this.get('pmController').get('Store').createModel('request', {
						id: elem.id + '0',
						res: 'bind_course_region_goods_time_unit',
						fmcond: this.get('pmController').get('Store').createModel('fmcond', {
							id: elem.id + 'fm',
							skip: 0,
							take: 1000
						})
					});
					let eqValues = [
						{ id: elem.id + '4', type: 'eqcond', key: 'time_type', val: 'month' },
						{ id: elem.id + '1', type: 'eqcond', key: 'course_id', val: ids.courseid },
						{ id: elem.id + '2', type: 'eqcond', key: 'region_id', val: elem.id },
						{ id: elem.id + '3', type: 'eqcond', key: 'time', val: '17-12' },
					];
					eqValues.forEach((elem) => {
						req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, {
							id: elem.id,
							key: elem.key,
							val: elem.val,
						}))
					});
					let conditions = this.get('pmController').get('Store').object2JsonApi(req);

					return this.store.queryMultipleObject('/api/v1/findAllMedUnit/0', 'bind_course_region_goods_time_unit', conditions)
				});
				return {
					regions: regions,
					tabledata: Promise.all(promiseArray)
				}
			})
			.then((res) => {
				return res.tabledata.then((data) => {
					return {
						regionList: res.regions,
						tableData: tableData(data)
					}
				})
			})
	}
});
