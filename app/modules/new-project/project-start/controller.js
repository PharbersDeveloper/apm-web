import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { groupBy } from '../../phtool/tool';

export default Controller.extend({
	introduced: inject('introduced-service'),
	actions: {
		close() {
			this.get('introduced').set('isSelectedName', '')
		},
		changeTab(name) {
			let ids = this.get('ids');

			function _conditions(request, anyConditions) {
				anyConditions.forEach((elem, index) => {
					request.get(elem.type).pushObject(request.store.createRecord(elem.type, {
						key: elem.key,
						val: elem.val,
					}))
				});
				return request.store.object2JsonApi('request', request);
			};

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

			if (name === 'showProduct') {

				/**
				 * 备注：Promise的链式调用，未做catch处理
				 */
				this.store.queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions)
					.then(data => { // 处理公司产品
						data.forEach(elem => {
							elem.set('compete', false)
							medicines.pushObject(elem)
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
								{ type: 'eqcond', key: 'course_id', val: ids.courseid },
								{ type: 'eqcond', key: 'goods_id', val: reval.id },
							]
							let conditions = _conditions(req, eqValues);
							return that.store.queryMultipleObject('/api/v1/findCompetGoods/0', 'medicine', conditions)
						});
						return Promise.all(promiseArray)
					})
					.then(data => { // 处理竞品
						data.forEach(reVal => {
							reVal.forEach(elem => {
								medicines.pushObject(elem)
							})
						})
						return medicines;
					})
					.then(data => { // 获取折线图数据
						let req = this.store.createRecord('request', {
							res: 'bind_course_region_goods_ym_sales',
							fmcond: this.store.createRecord('fmcond', {
								skip: 0,
								take: 1000
							})
						});
						let promiseArray = data.map(elem => {
							let eqValues = [
								{ type: 'eqcond', key: 'course_id', val: ids.courseid },
								{ type: 'eqcond', key: 'goods_id', val: elem.id },
								{ type: 'gtecond', key: 'ym', val: '17-01' },
								{ type: 'ltecond', key: 'ym', val: '17-12' },
							]
							let conditions = _conditions(req, eqValues)
							return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
						});
						return Promise.all(promiseArray)
					})
					.finally(() => {
						let that = this;
						let lineData = [];

						function d3Data(medicineArrayObject) {
							Object.keys(medicineArrayObject).forEach(key => {
								let temp = groupBy(medicineArrayObject[key], 'ym');
								let record = that.store.peekRecord('medicine', key);
								let values = Object.keys(temp).map(elem => {
									let sum = temp[elem].reduce((acc, cur) => acc + cur.sales.share, 0);
									return {
										ym: elem,
										value: sum
									}
								});
								lineData.pushObject({
									name: record.corp_name,
									values
								});
							})
						}
						let medicineList = this.store.peekAll('bind_course_region_goods_ym_sales');
						let medicineAll = groupBy(medicineList.filter(elem => elem.region_id === 'all'), 'goods_id');
						d3Data(medicineAll)

						let productInfo = {
							medicines,
							lineData
						}
						this.set('ProductModel', productInfo);
					})
			} else if (name === 'showArea') {

				let regionBaseInfo = {}
				// 获取所有区域名称与基本信息
				let req = this.store.createRecord('request', { res: 'bind_course_region' });
				req.get('eqcond').pushObject(this.store.createRecord('eqcond', {
					key: 'course_id',
					val: ids.courseid,
				}))
				let conditions = this.store.object2JsonApi('request', req);

				return this.store.queryMultipleObject('/api/v1/regionLst/0', 'region', conditions)
					.then(data => { // 处理区域基本数据
						regionBaseInfo.info = data;
						return data;
					})
					.then(data => { // 处理cards数据
						regionBaseInfo.cards = [];
						let regionData = this.store.peekAll('bind_course_region_goods_ym_sales');
						data.forEach(elem => {
							let filtrerData = regionData.filter(felem => felem.region_id == elem.id);
							regionBaseInfo.cards.pushObject(filtrerData.lastObject)
						});
						return null
					})
					.then(() => { // 获取雷达图数据
						req = this.store.createRecord('request', { res: 'bind_course_region_radar' });
						req.get('eqcond').pushObject(this.store.createRecord('eqcond', {
							key: 'course_id',
							val: ids.courseid,
						}))
						conditions = this.store.object2JsonApi('request', req);
						return this.store.queryMultipleObject('/api/v1/findRadarFigure/0', 'bind_course_region_radar', conditions)
					})
					.then(data => { // 处理雷塔图数据
						let radarArray = data.filter(elem => elem.region_id !== 'ave');
						let ave = data.find(elem => elem.region_id === 'ave');

						function axes(radarfigure) {
							let axes = [];
							axes.pushObject({
								axis: '产品知识',
								value: radarfigure.prod_knowledge_val
							})

							axes.pushObject({
								axis: '目标拜访频次',
								value: radarfigure.target_call_freq_val
							})

							axes.pushObject({
								axis: '拜访次数',
								value: radarfigure.call_times_val
							})

							axes.pushObject({
								axis: '实际工作天数',
								value: radarfigure.in_field_days_val
							})

							axes.pushObject({
								axis: '工作积极性',
								value: radarfigure.motivation_val
							})

							axes.pushObject({
								axis: '区域管理能力',
								value: radarfigure.territory_manage_val
							})

							axes.pushObject({
								axis: '销售能力',
								value: radarfigure.sales_skills_val
							})
							return axes
						}
						let radarData = radarArray.map(elem => {
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
						regionBaseInfo.radarData = radarData;
						return null;
					})
					.then(() => { // 获取所有区域的负责代表
						let regionCache = this.store.peekAll('region');
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
						})
						return Promise.all(promiseArray)
					})
					.then(data => { // 处理所有区域的负责代表
						regionBaseInfo.represents = [];
						data.forEach((elem, index) => {
							// 绑定区域与人员关系，方便缓存读取
							this.store.createRecord('bind_course_region_rep', {
								id: index,
								region_id: elem.query.included[0].attributes.val,
								represents: elem.map(x => x.id)
							})
							regionBaseInfo.represents.pushObject({
								region_id: elem.query.included[0].attributes.val,
								data: elem
							})
						})
						return null
					})
					.then(() => { // 获取kpi表格数据
						let regionCache = this.store.peekAll('region');
						let promiseArray = regionCache.map(elem => {
							req = this.store.createRecord('request', { res: 'bind_course_region_ym_rep_behavior' });
							let eqValues = [
								{ type: 'eqcond', key: 'region_id', val: elem.id },
								{ type: 'eqcond', key: 'course_id', val: ids.courseid },
								{ type: 'gtecond', key: 'ym', val: '17-01' },
								{ type: 'ltecond', key: 'ym', val: '17-12' },
							]
							eqValues.forEach((elem) => {
								req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
									key: elem.key,
									val: elem.val,
								}))
							});
							let conditions = this.store.object2JsonApi('request', req);
							return this.store.queryMultipleObject('/api/v1/findRepBehavior/0', 'bind_course_region_ym_rep_behavior', conditions)
						})
						return Promise.all(promiseArray)
					})
					.then(data => { // 处理KPI表格数据
						let kpi = []
						data.forEach(elem => {
							let region_id = elem.firstObject.region_id
							let yms = elem.map(ele => ele.ym)
							let target_call_freq_vals = elem.map(ele => ele.repbehaviorreport.target_call_freq_val);
							let in_field_days_vals = elem.map(ele => ele.repbehaviorreport.in_field_days_val);
							let call_times_vals = elem.map(ele => ele.repbehaviorreport.call_times_val);
							kpi.pushObject({
								region_id,
								yms,
								target_call_freq_vals,
								in_field_days_vals,
								call_times_vals
							})
						});
						regionBaseInfo.kpi = kpi
						return null
					})
					.then(() => { // 获取业务报告数据
						let regionCache = this.store.peekAll('region');
						let promiseArray = regionCache.map(elem => {
							req = this.store.createRecord('request', { res: 'bind_course_region_business' });
							let eqValues = [
								{ type: 'eqcond', key: 'region_id', val: elem.id },
								{ type: 'eqcond', key: 'course_id', val: ids.courseid }
							]
							eqValues.forEach((elem) => {
								req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
									key: elem.key,
									val: elem.val,
								}))
							});
							let conditions = this.store.object2JsonApi('request', req);
							return this.store.queryMultipleObject('/api/v1/findBusinessReport/0', 'bind_course_region_business', conditions)
						})
						return Promise.all(promiseArray)
					})
					.then(data => { // 处理业务报告数据
						let reports = data.map(elem => {
							let content = elem.map(ele => {
								return {
									title: ele.businessreport.title,
									des: ele.businessreport.description
								}
							})
							return {
								region_id: elem.query.included[0].attributes.val,
								data: content
							}
						});
						regionBaseInfo.reports = reports
						return null
					})
					.then(() => { // 柱状图
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
						let medicineList = this.store.peekAll('bind_course_region_goods_ym_sales');
						let medicineByRegion = groupBy(medicineList.filter(elem => elem.region_id !== 'all'), 'region_id');
						regionBaseInfo.salesBar = d3Data(medicineByRegion)
						return null;
					})
					.then(() => { // 整体
						let that = this;

						function d3Data(medicineArrayObject) {
							return Object.keys(medicineArrayObject).map(key => {
								return {
									name: that.store.peekRecord('region', key).name,
									values: medicineArrayObject[key].map(elem => {
										return {
											ym: elem.ym,
											value: elem.sales.share,
										}
									})
								}
							})
						}

						function tableData(arrayObjec) {
							return Object.keys(arrayObjec).map(key => {
								let potential = arrayObjec[key].lastObject.sales.potential.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.potential, 0).toFixed(2);
								let potential_contri = arrayObjec[key].lastObject.sales.potential_contri.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.potential_contri, 0).toFixed(2);
								let sales = arrayObjec[key].lastObject.sales.sales.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales, 0).toFixed(2);
								let sales_contri = arrayObjec[key].lastObject.sales.sales_contri.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales_contri, 0).toFixed(2);
								let contri_index = arrayObjec[key].lastObject.sales.contri_index.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.contri_index, 0).toFixed(2);
								let sales_growth = arrayObjec[key].lastObject.sales.sales_growth.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales_growth, 0).toFixed(2);
								return {
									name: that.store.peekRecord('region', key).name,
									potential,
									potential_contri,
									sales,
									sales_contri,
									contri_index,
									sales_growth
								}
							})
						}
						let medicineList = this.store.peekAll('bind_course_region_goods_ym_sales');
						// TODO 这块有疑问 是所有区域还是只有本公司产品？
						let medicineByRegion = groupBy(medicineList.filter(elem => elem.region_id !== 'all'), 'region_id');
						regionBaseInfo.overall = {
							lineData: d3Data(medicineByRegion),
							tableData: tableData(medicineByRegion)
						}
						return ids
					})
					.finally(() => {
						this.set('AreaModel', regionBaseInfo);
					})

			}

		},
	}
});