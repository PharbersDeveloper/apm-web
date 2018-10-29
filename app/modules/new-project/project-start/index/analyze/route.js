import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';

export default Route.extend({
	model() {
		let that = this;
		let ids = this.modelFor('new-project.project-start');
		this.controllerFor('new-project.project-start.index.analyze').set('params', ids);
		// let regionList = this.store.peekAll('region');
		// console.log(regionList)

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
				let potential = item.lastObject.sales.potential.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.potential, 0).toFixed(2);
				let potential_contri = item.lastObject.sales.potential_contri.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.potential_contri, 0).toFixed(2);
				let sales = item.lastObject.sales.sales.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales, 0).toFixed(2);
				let sales_contri = item.lastObject.sales.sales_contri.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales_contri, 0).toFixed(2);
				let contri_index = item.lastObject.sales.contri_index.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.contri_index, 0).toFixed(2);
				let sales_growth = item.lastObject.sales.sales_growth.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales_growth, 0).toFixed(2);
				return {
					name: that.store.peekRecord('region', item.lastObject.region_id).name,
					potential,
					potential_contri,
					sales,
					sales_contri,
					contri_index,
					sales_growth
				}
			})
		};

		// 获取所有区域名称与基本信息
		let req = this.get('pmController').get('Store').createModel('request', { id: '0', res: 'bind_course_region' });
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
				// req = this.get('pmController').get('Store').createModel('request', {
				// 	id: '0',
				// 	res: 'bind_course_region_goods_ym_sales',
				// 	fmcond: this.get('pmController').get('Store').createModel('fmcond', {
				// 		id: 'fm11',
				// 		skip: 0,
				// 		take: 1000
				// 	})
				// });
				let promiseArray = regions.map(elem => {
					req = this.get('pmController').get('Store').createModel('request', {
						id: elem.id + '0',
						res: 'bind_course_region_goods_ym_sales',
						fmcond: this.get('pmController').get('Store').createModel('fmcond', {
							id: elem.id + 'fm',
							skip: 0,
							take: 1000
						})
					});
					let eqValues = [
						{ id: elem.id + '1', type: 'eqcond', key: 'course_id', val: ids.courseid },
						{ id: elem.id + '2', type: 'eqcond', key: 'region_id', val: elem.id },
						{ id: elem.id + '3', type: 'eqcond', key: 'ym', val: '17-12' },

					];
					eqValues.forEach((elem) => {
						req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, {
							id: elem.id,
							key: elem.key,
							val: elem.val,
						}))
					});
					let conditions = this.get('pmController').get('Store').object2JsonApi(req);

					this.get('logger').log(conditions);

					return this.store.queryMultipleObject('/api/v1/findAllMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
					// return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
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


		// return Promise.all(promiseArray).then((res) => {
		// 	return {
		// 		regionList,
		// 		tableData: tableData(res)
		// 	}
		// })


		// let medicineList = this.store.peekAll('bind_course_region_goods_ym_sales');
		// let regionList = this.store.peekAll('region');

		// TODO 这块有疑问 是所有区域还是只有本公司产品？
		// let medicineByRegion = groupBy(medicineList.filter(elem => elem.region_id !== 'all'), 'region_id');
		// console.log(medicineByRegion);
		// console.log(medicineList);
		// console.info(this.modelFor('new-project.project-start'));
		// let paramsController = this.modelFor('new-project.project-start');
		// this.controllerFor('new-project.project-start.index.analyze').set('params', ids);
		// return {
		// 	regionList,
		// 	tableData: tableData(medicineByRegion)
		// }
	}
});