import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { groupBy } from '../../phtool/tool';
import { set } from '@ember/object';

export default Controller.extend({
	i18n: inject(),
	introduced: inject('introduced-service'),
	actions: {
		close() {
			this.get('introduced').set('isSelectedName', '')
		},
		// 改变显示区域，tab属性调用ember-bs，id为要显示的区域id
		changeRegion(component, id) {
			let that = this;
			let ids = this.get('ids');
			let singleRegionData = {};
			component.set('newDataReady', false);
			if (id !== 'all') {
				// 获取区域的负责代表
				let regionCache = this.store.peekAll('region');

				let req = this.get('pmController').get('Store').createModel('request', { id: '0', res: 'bind_course_region_rep' });
				let eqValues = [
					{ id: 1, type: 'eqcond', key: 'region_id', val: id },
					{ id: 2, type: 'eqcond', key: 'course_id', val: ids.courseid },
				]
				eqValues.forEach((elem) => {
					req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, {
						id: elem.id,
						key: elem.key,
						val: elem.val,
					}))
				});
				let conditions = this.store.object2JsonApi(req);
				this.store.queryMultipleObject('/api/v1/findRegionRep/0', 'representative', conditions)
					.then((res) => {
						singleRegionData.represent = res.firstObject;
						return null;
					})
					.then(()=> {	// 获取卡片病人人数
						// TODO: 目前只有一个公司产品，就没有添加goods_id 的查询条件，
						// 当公司产品有两个及以上后，需添加goods_id
						req = this.get('pmController').get('Store').createModel('request',
							{ id: '0', res: 'bind_course_region_goods_time_patient' });
						let eqValues = [
							{ id: 5, type: 'eqcond', key: 'time_type', val: 'month' },
							{ id: 1, type: 'eqcond', key: 'region_id', val: id },
							{ id: 2, type: 'eqcond', key: 'course_id', val: ids.courseid },
							{ id: 4, type: 'eqcond', key: 'time', val: '17-12' },
						]
						eqValues.forEach((elem) => {
							req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, {
								id: elem.id,
								key: elem.key,
								val: elem.val,
							}))
						});
						let conditions = this.store.object2JsonApi(req);
						return this.store.queryMultipleObject('/api/v1/findAllMedPatient/0', 'bind_course_region_goods_time_patient', conditions)
					})
					.then((data) => { // 处理卡片数据
						let patient = data.firstObject.patient;
						this.get('logger').log(patient);
						let regionData = this.store.peekAll('bind_course_region_goods_time_unit');
						let filtrerData = regionData.filter(felem => felem.region_id == id);
						let card = {};
						card = filtrerData.find((item) => {
							return item.time === "17-12";
						})
						// let allYearPotential = 0;
						// filtrerData.forEach((item) => {
						// 	allYearPotential += item.unit.potential;
						// });
						card.unit.set('patient', patient);
						singleRegionData.card = card;
						return null;;
					})
					.then(() => { // 获取平均雷达图数据
						req = this.get('pmController').get('Store').createModel('request',
							{ id: '0', res: 'bind_course_region_radar' });
						let eqValues = [
							{ id: 1, type: 'eqcond', key: 'region_id', val: 'ave' },
							{ id: 2, type: 'eqcond', key: 'course_id', val: ids.courseid },
						];
						eqValues.forEach((elem) => {
							req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, {
								id: elem.id,
								key: elem.key,
								val: elem.val,
							}))
						});
						conditions = this.store.object2JsonApi(req);
						return this.store.queryMultipleObject('/api/v1/findRadarFigure/0', 'bind_course_region_radar', conditions)
					})
					.then((data) => { // 获取雷达图数据
						req = this.get('pmController').get('Store').createModel('request', { id: '0', res: 'bind_course_region_radar' });
						let eqValues = [
							{ id: 1, type: 'eqcond', key: 'region_id', val: id },
							{ id: 2, type: 'eqcond', key: 'course_id', val: ids.courseid },
						];
						eqValues.forEach((elem) => {
							req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, {
								id: elem.id,
								key: elem.key,
								val: elem.val,
							}))
						});

						conditions = this.store.object2JsonApi(req);
						return this.store.queryMultipleObject('/api/v1/findRadarFigure/0', 'bind_course_region_radar', conditions)
					})
					.then(data => { // 处理雷塔图数据
						let ave = this.store.peekAll('bind_course_region_radar').find((item) => {
							return item.region_id === 'ave';
						});

						function axes(radarfigure) {
							let axes = [];
							axes.pushObject({
								axis: that.i18n.t('apm.component.radar.prodKnowledge') + "",
								value: radarfigure.prod_knowledge_val
							})

							axes.pushObject({
								axis: that.i18n.t('apm.component.radar.targetVisit') + "",
								value: radarfigure.target_call_freq_val
							})

							axes.pushObject({
								axis: that.i18n.t('apm.component.radar.visitTime') + "",
								value: radarfigure.target_occupation_val
							})

							axes.pushObject({
								axis: that.i18n.t('apm.component.radar.localWorkDay') + "",
								value: radarfigure.in_field_days_val
							})

							axes.pushObject({
								axis: that.i18n.t('apm.component.radar.workEnthusiasm') + "",
								value: radarfigure.motivation_val
							})

							axes.pushObject({
								axis: that.i18n.t('apm.component.radar.areaManageAbility') + "",
								value: radarfigure.territory_manage_val
							})

							axes.pushObject({
								axis: that.i18n.t('apm.component.radar.saleAbility') + "",
								value: radarfigure.sales_skills_val
							})
							return axes
						}

						let regionCache = this.store.peekRecord('region', id);
						let radarData = [{
								name: that.i18n.t('apm.component.radar.areaAvg') + "",
								axes: axes(ave.radarfigure),
								color: '#762712'
							},
							{
								name: regionCache.name,
								axes: axes(data.firstObject.radarfigure),
								color: '#26AF32'
							}
						];
						// component.set('radarData', radarData);
						singleRegionData.radarData = radarData;
						return null;
					})
					.then(() => { // 获取kpi表格数据
						req = this.get('pmController').get('Store').createModel('request',
							{ id: '0', res: 'bind_course_region_time_rep_behavior' });
						let eqValues = [
							{ id: 5, type: 'eqcond', key: 'time_type', val: 'month' },
							{ id: 1, type: 'eqcond', key: 'region_id', val: id },
							{ id: 2, type: 'eqcond', key: 'course_id', val: ids.courseid },
							{ id: 3, type: 'gtecond', key: 'time', val: '17-01' },
							{ id: 4, type: 'ltecond', key: 'time', val: '17-12' },
						]
						eqValues.forEach((elem) => {
							req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, {
								id: elem.id,
								key: elem.key,
								val: elem.val,
							}))
						});
						let conditions = this.store.object2JsonApi(req);
						return this.store.queryMultipleObject('/api/v1/findRepBehavior/0', 'bind_course_region_time_rep_behavior', conditions)
					})
					.then(data => { // 处理KPI表格数据
						let kpiData = {};
						let region_id = id
						let yms = data.map(ele => ele.ym)
						let target_call_freq_vals = data.map(ele => ele.repbehaviorreport.target_call_freq_val);
						let in_field_days_vals = data.map(ele => ele.repbehaviorreport.in_field_days_val);
						let target_occupation_vals = data.map(ele => ele.repbehaviorreport.target_occupation_val);

						kpiData = {
							region_id,
							yms,
							target_call_freq_vals,
							in_field_days_vals,
							target_occupation_vals
						}
						// component.set('kpiData', kpiData);
						singleRegionData.kpiData = kpiData;

						return null
					})
					.then(() => { // 获取业务报告数据
						req = this.get('pmController').get('Store').createModel('request',
							{ id: '0', res: 'bind_course_region_business' });
						let eqValues = [
							{ id: 1, type: 'eqcond', key: 'region_id', val: id },
							{ id: 2, type: 'eqcond', key: 'course_id', val: ids.courseid }
						]
						eqValues.forEach((elem) => {
							req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, {
								id: elem.id,
								key: elem.key,
								val: elem.val,
							}))
						});
						let conditions = this.store.object2JsonApi(req);
						return this.store.queryMultipleObject('/api/v1/findBusinessReport/0', 'bind_course_region_business', conditions)
					})
					.then(data => { // 处理业务报告数据
						let report = data.map(ele => {
							return {
								title: ele.businessreport.title,
								des: ele.businessreport.description
							}
						})
						// component.set('report', report);
						singleRegionData.report = report;
						return null
					})
					.then(() => { // 柱状图
						function d3Data(medicineArrayObject) {
							let data = medicineArrayObject[id].map(elem => {
								return {
									key: elem.time,
									value: elem.unit.unit,
									value2: (elem.unit.share * 100).toFixed(1)
								}
							});
							data.length = 12;
							data.sort((a, b) => {
								return a.key.slice(-2) - b.key.slice(-2);
							})
							return {
								id: id,
								data: data
							}
						}
						let medicineList = this.store.peekAll('bind_course_region_goods_time_unit');
						let medicineByYm = medicineList.filter(elem => elem.time !== '18-01' && elem.time !== '18-02' && elem.time !== '18-03');
						let medicineNoSeason = medicineByYm.filter(elem => elem.time.indexOf('q') < 0);
						let medicineByRegion = groupBy(medicineNoSeason.filter(elem => elem.region_id === id), 'region_id');

						let data = d3Data(medicineByRegion);
						singleRegionData.salesBar = data;
						component.set('newDataReady', true);

						component.set('singleRegionData', singleRegionData);

						return null;
					})
			}
		},

		changeTab(name) {
			let ids = this.get('ids');

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

			let req = this.get('pmController').get('Store').createModel('request', {
				id: '0',
				res: 'bind_course_goods',
				fmcond: this.get('pmController').get('Store').createModel('fmcond', {
					id: 'fm01',
					skip: 0,
					take: 20
				})
			});

			let eqValues = [{ id: 1, type: 'eqcond', key: 'course_id', val: ids.courseid }]

			let conditions = _conditions(req, eqValues);
			let medicines = [];

			if (name === 'showProduct') {
				//  备注：Promise的链式调用，未做catch处理
				this.store.queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions)
					.then(data => { // 处理公司产品
						data.forEach(elem => {
							elem.set('compete', false)
							medicines.pushObject(elem)
						});
						return data;
					})
					.then(data => { // 获取公司产品折线图数据
						let req = this.get('pmController').get('Store').createModel('request', {
							id: '0',
							res: 'bind_course_region_goods_time_unit',
							fmcond: this.get('pmController').get('Store').createModel('fmcond', {
								id: 'fmline',
								skip: 0,
								take: 1000
							})
						});
						// let promiseArray = data.map(elem => {
						let eqValues = [
							{ id: 5, type: 'eqcond', key: 'time_type', val: 'month' },
							{ id: 1, type: 'eqcond', key: 'course_id', val: ids.courseid },
							{ id: 2, type: 'eqcond', key: 'goods_id', val: data.firstObject.id },
							{ id: 3, type: 'gtecond', key: 'time', val: '17-01' },
							{ id: 4, type: 'ltecond', key: 'time', val: '17-12' },
						]
						let conditions = _conditions(req, eqValues)
						return this.store.queryMultipleObject('/api/v1/findAllMedUnit/0', 'bind_course_region_goods_time_unit', conditions)

						// });
						// return Promise.all(promiseArray)
					})
					.then(data => { // 获取公司的竞品
						let that = this;
						let companyProd = this.store.peekAll('medicine').filter((item) => {
							return !item.compete;
						});

						let promiseArray = companyProd.map(reval => {
							let req = that.store.createRecord('request', {
								id: '0',
								res: 'bind_course_goods_compet',
								fmcond: that.store.createRecord('fmcond', {
									id: 'fmcompete',
									skip: 0,
									take: 20
								})
							});
							let eqValues = [
								{ id: 1, type: 'eqcond', key: 'course_id', val: ids.courseid },
								{ id: 2, type: 'eqcond', key: 'goods_id', val: reval.id },
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
					// TODO:
					// 由于接口返回的数据过慢，目前只好把竞品以PromiseAll的形式，
					// 换成一个一个请求。
					// 目前写成了固定了三个竞品。不符合以后的情况。
					.then(data => { // 获取竞品 firstObject折线图数据
						let competeProd = this.store.peekAll('medicine').filter((item) => {
							return item.compete;
						});

						let firstCompete = competeProd.firstObject;
						let req = this.get('pmController').get('Store').createModel('request', {
							id: '0',
							res: 'bind_course_region_goods_time_unit',
							fmcond: this.get('pmController').get('Store').createModel('fmcond', {
								id: 'fmfirstcompete',
								skip: 0,
								take: 1000
							})
						});
						let eqValues = [
							{ id: 5, type: 'eqcond', key: 'time_type', val: 'month' },
							{ id: 1, type: 'eqcond', key: 'course_id', val: ids.courseid },
							{ id: 2, type: 'eqcond', key: 'goods_id', val: firstCompete.id },
							{ id: 3, type: 'gtecond', key: 'time', val: '17-01' },
							{ id: 4, type: 'ltecond', key: 'time', val: '17-12' },
						]
						let conditions = _conditions(req, eqValues)
						return this.store.queryMultipleObject('/api/v1/findAllMedUnit/0', 'bind_course_region_goods_time_unit', conditions)

						// return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
					})
					.then(data => { // 获取竞品 secondObject折线图数据
						let competeProd = this.store.peekAll('medicine').filter((item) => {
							return item.compete;
						});

						let secondCompete = competeProd[1];
						let req = this.get('pmController').get('Store').createModel('request', {
							id: '0',
							res: 'bind_course_region_goods_time_unit',
							fmcond: this.get('pmController').get('Store').createModel('fmcond', {
								id: 'fmsecondcompete',
								skip: 0,
								take: 1000
							})
						});
						let eqValues = [
							{ id: 5, type: 'eqcond', key: 'time_type', val: 'month' },
							{ id: 1, type: 'eqcond', key: 'course_id', val: ids.courseid },
							{ id: 2, type: 'eqcond', key: 'goods_id', val: secondCompete.id },
							{ id: 3, type: 'gtecond', key: 'time', val: '17-01' },
							{ id: 4, type: 'ltecond', key: 'time', val: '17-12' },
						]
						let conditions = _conditions(req, eqValues)
						return this.store.queryMultipleObject('/api/v1/findAllMedUnit/0', 'bind_course_region_goods_time_unit', conditions)
					})
					.then(data => { // 获取竞品 thirdObject折线图数据
						let competeProd = this.store.peekAll('medicine').filter((item) => {
							return item.compete;
						});

						let lastCompete = competeProd.lastObject;
						let req = this.get('pmController').get('Store').createModel('request', {
							id: '0',
							res: 'bind_course_region_goods_time_unit',
							fmcond: this.get('pmController').get('Store').createModel('fmcond', {
								id: 'fmThirdCompete',
								skip: 0,
								take: 1000
							})
						});
						let eqValues = [
							{ id: 5, type: 'eqcond', key: 'time_type', val: 'month' },

							{ id: 1, type: 'eqcond', key: 'course_id', val: ids.courseid },
							{ id: 2, type: 'eqcond', key: 'goods_id', val: lastCompete.id },
							{ id: 3, type: 'gtecond', key: 'time', val: '17-01' },
							{ id: 4, type: 'ltecond', key: 'time', val: '17-12' },
						]
						let conditions = _conditions(req, eqValues)
						return this.store.queryMultipleObject('/api/v1/findAllMedUnit/0', 'bind_course_region_goods_time_unit', conditions)
					})
					/*
						.then(data => { // 获取折线图数据
							let req = this.get('pmController').get('Store').createModel('request', {
								res: 'bind_course_region_goods_ym_sales',
								fmcond: this.get('pmController').get('Store').createModel('fmcond', {
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
					*/
					.finally(() => {
						let that = this;
						let originLineData = [];

						function d3Data(medicineArrayObject) {
							Object.keys(medicineArrayObject).forEach(key => {
								let temp = groupBy(medicineArrayObject[key], 'time');
								let record = that.store.peekRecord('medicine', key);
								let values = Object.keys(temp).map(elem => {
									let sum = temp[elem].reduce((acc, cur) => acc + cur.unit.share, 0);
									return {
										ym: elem,
										value: sum
									}
								});
								values.sort((a, b) => {
									return a.ym.slice(-2) - b.ym.slice(-2);
								})
								originLineData.pushObject({
									name: record.prod_name,
									values
								});
							})
						}

						let medicineList = this.store.peekAll('bind_course_region_goods_time_unit');
						// let outSeason = medicineList.forEach((item) => {
						// 	return item.ym.indexOf('q') < 0;
						// });
						let medicineAll = groupBy(medicineList.filter(elem => elem.region_id === 'all' && elem.time.indexOf('q') < 0), 'goods_id');
						d3Data(medicineAll);
						let lineData = medicines.map((item) => {
							let line = {}
							originLineData.forEach((ele) => {
								if (item.prod_name === ele.name) {
									line = ele
								}
							});
							return line;
						});
						let productInfo = {
							medicines,
							lineData
						}
						this.set('ProductModel', productInfo);
					})
			} else if (name === 'showArea') {

				let regionBaseInfo = {}
				// 获取所有区域名称与基本信息
				let req = this.get('pmController').get('Store').createModel('request',
					{ id: 'region0', res: 'bind_course_region' });
				req.get('eqcond').pushObject(this.get('pmController').get('Store').createModel('eqcond', {
					id: 'region1',
					key: 'course_id',
					val: ids.courseid,
				}))
				let conditions = this.store.object2JsonApi(req);

				return this.store.queryMultipleObject('/api/v1/regionLst/0', 'region', conditions)
					.then(data => { // 处理区域基本数据
						regionBaseInfo.info = data;
						return data;
					})
					.then(data => { // 获取折线图数据
						// let req = this.get('pmController').get('Store').createModel('request', {
						// 	id: 'line0',
						// 	res: 'bind_course_region_goods_ym_sales',
						// 	fmcond: this.get('pmController').get('Store').createModel('fmcond', {
						// 		id: 'fmline',
						// 		skip: 0,
						// 		take: 1000
						// 	})
						// });
						let promiseArray = data.map(elem => {
							let req = this.get('pmController').get('Store').createModel('request', {
								id: elem.id + 'line0',
								res: 'bind_course_region_goods_time_unit',
								fmcond: this.get('pmController').get('Store').createModel('fmcond', {
									id: elem.id + 'fmline',
									skip: 0,
									take: 1000
								})
							});
							let eqValues = [
								{ id: elem.id + '5',  type: 'eqcond', key: 'time_type', val: 'month' },
								{ id: elem.id + '1', type: 'eqcond', key: 'course_id', val: ids.courseid },
								{ id: elem.id + '2', type: 'eqcond', key: 'region_id', val: elem.id },
								{ id: elem.id + '3', type: 'gtecond', key: 'time', val: '17-01' },
								{ id: elem.id + '4', type: 'ltecond', key: 'time', val: '17-12' },
							]
							let conditions = _conditions(req, eqValues);
							return this.store.queryMultipleObject('/api/v1/findAllMedUnit/0', 'bind_course_region_goods_time_unit', conditions)
							// return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
						});
						return Promise.all(promiseArray)
					})
					.finally(() => {
						let that = this;

						function d3Data(medicineArrayObject) {
							let medicineKeys = Object.keys(medicineArrayObject).sort();
							return medicineKeys.map(key => {
								let name = that.store.peekRecord('region', key).name;
								let values = medicineArrayObject[key].map(elem => {
									return {
										ym: elem.time,
										value: elem.unit.share,
									}
								});
								let valuesWithoutSeason = [];
								values.forEach((elem) => {
									if (elem.ym.indexOf('q') < 0) {
										valuesWithoutSeason.pushObject(elem)
									}
								});
								valuesWithoutSeason.length = 12;
								valuesWithoutSeason.sort((a, b) => {
									return a.ym.slice(-2) - b.ym.slice(-2);
								})
								return {
									name: name,
									values: valuesWithoutSeason
								}
							});

						}

						function tableData(arrayObjec) {
							let arrayKeys = Object.keys(arrayObjec).sort();
							return arrayKeys.map(key => {
								let decMonth = arrayObjec[key].find((item) => {
									return item.time === "17-12"
								});
								let potential = decMonth.unit.potential.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.potential, 0).toFixed(2);
								let potential_contri = decMonth.unit.potential_contri.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.potential_contri, 0).toFixed(2);

								let unit = decMonth.unit.unit.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales, 0).toFixed(2);
								let contri = decMonth.unit.contri.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales_contri, 0).toFixed(2);
								let contri_index = decMonth.unit.contri_index.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.contri_index, 0).toFixed(2);
								let growth = decMonth.unit.growth.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales_growth, 0).toFixed(2);
								return {
									name: that.store.peekRecord('region', key).name,
									potential,
									potential_contri,
									unit,
									contri,
									contri_index,
									growth
								}
							})
						}
						let medicineList = this.store.peekAll('bind_course_region_goods_time_unit');
						// TODO 这块有疑问 是所有区域还是只有本公司产品？
						let medicineByYm = medicineList.filter(elem => elem.time !== '18-01' && elem.time !== '18-02' && elem.time !== '18-03');
						// let medicineByRegion = groupBy(medicineList.filter(elem => elem.region_id !== 'all'), 'region_id');
						let medicineByRegion = groupBy(medicineByYm.filter(elem => elem.region_id !== 'all'), 'region_id');
						regionBaseInfo.overall = {
							lineData: d3Data(medicineByRegion),
							tableData: tableData(medicineByRegion)
						}
						this.set('AreaModel', regionBaseInfo);
					})

			}

		},
	}
});
