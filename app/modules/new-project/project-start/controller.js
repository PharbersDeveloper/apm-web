import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { groupBy } from '../../phtool/tool';
import { set } from '@ember/object';

export default Controller.extend({
	introduced: inject('introduced-service'),
	actions: {
		close() {
			this.get('introduced').set('isSelectedName', '')
		},
		// 改变显示区域，tab属性调用ember-bs，id为要显示的区域id
		changeRegion(component, id) {
			let ids = this.get('ids');
			let singleRegionData = {};
			component.set('newDataReady', false);
			if (id !== 'all') {
				// 获取区域的负责代表
				let regionCache = this.store.peekAll('region');

				let req = this.store.createRecord('request', { res: 'bind_course_region_rep' });
				let eqValues = [
					{ type: 'eqcond', key: 'region_id', val: id },
					{ type: 'eqcond', key: 'course_id', val: ids.courseid },
				]
				eqValues.forEach((elem) => {
					req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
						key: elem.key,
						val: elem.val,
					}))
				});
				let conditions = this.store.object2JsonApi('request', req);
				this.store.queryMultipleObject('/api/v1/findRegionRep/0', 'representative', conditions)
					.then((res) => {
						singleRegionData.represent = res.firstObject;
						return null;
					})
					.then(() => { // 处理卡片数据
						let regionData = this.store.peekAll('bind_course_region_goods_ym_sales');
						let filtrerData = regionData.filter(felem => felem.region_id == id);
						let card = {};
						card = filtrerData.find((item) => {
							return item.ym === "17-12";
						})
						let allYearPotential = 0;
						filtrerData.forEach((item) => {
							allYearPotential += item.sales.potential;
						});
						card.sales.set('allyearpotential', allYearPotential);
						singleRegionData.card = card;
						return null;;
					})
					.then(() => { // 获取平均雷达图数据
						req = this.store.createRecord('request', { res: 'bind_course_region_radar' });
						let eqValues = [
							{ type: 'eqcond', key: 'region_id', val: 'ave' },
							{ type: 'eqcond', key: 'course_id', val: ids.courseid },
						];
						eqValues.forEach((elem) => {
							req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
								key: elem.key,
								val: elem.val,
							}))
						});
						conditions = this.store.object2JsonApi('request', req);
						return this.store.queryMultipleObject('/api/v1/findRadarFigure/0', 'bind_course_region_radar', conditions)
					})
					.then((data) => { // 获取雷达图数据
						req = this.store.createRecord('request', { res: 'bind_course_region_radar' });
						let eqValues = [
							{ type: 'eqcond', key: 'region_id', val: id },
							{ type: 'eqcond', key: 'course_id', val: ids.courseid },
						];
						eqValues.forEach((elem) => {
							req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
								key: elem.key,
								val: elem.val,
							}))
						});

						conditions = this.store.object2JsonApi('request', req);
						return this.store.queryMultipleObject('/api/v1/findRadarFigure/0', 'bind_course_region_radar', conditions)
					})
					.then(data => { // 处理雷塔图数据
						let ave = this.store.peekAll('bind_course_region_radar').find((item) => {
							return item.region_id === 'ave';
						});

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

						let regionCache = this.store.peekRecord('region', id);
						let radarData = [{
								name: '区域平均',
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
						req = this.store.createRecord('request', { res: 'bind_course_region_ym_rep_behavior' });
						let eqValues = [
							{ type: 'eqcond', key: 'region_id', val: id },
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
					.then(data => { // 处理KPI表格数据
						let kpiData = {};
						let region_id = id
						let yms = data.map(ele => ele.ym)
						let target_call_freq_vals = data.map(ele => ele.repbehaviorreport.target_call_freq_val);
						let in_field_days_vals = data.map(ele => ele.repbehaviorreport.in_field_days_val);
						let call_times_vals = data.map(ele => ele.repbehaviorreport.call_times_val);
						kpiData = {
							region_id,
							yms,
							target_call_freq_vals,
							in_field_days_vals,
							call_times_vals
						}
						// component.set('kpiData', kpiData);
						singleRegionData.kpiData = kpiData;

						return null
					})
					.then(() => { // 获取业务报告数据
						req = this.store.createRecord('request', { res: 'bind_course_region_business' });
						let eqValues = [
							{ type: 'eqcond', key: 'region_id', val: id },
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
									key: elem.ym,
									value: elem.sales.sales,
									value2: (elem.sales.share * 100).toFixed(1)
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
						let medicineList = this.store.peekAll('bind_course_region_goods_ym_sales');
						let medicineByYm = medicineList.filter(elem => elem.ym !== '18-01' && elem.ym !== '18-02' && elem.ym !== '18-03');
						let medicineByRegion = groupBy(medicineByYm.filter(elem => elem.region_id === id), 'region_id');

						let data = d3Data(medicineByRegion);
						// console.log(data);
						// component.set('salesBar', data);
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
							{ type: 'gtecond', key: 'ym', val: '17-01' },
							{ type: 'ltecond', key: 'ym', val: '17-12' },
						]
						let conditions = _conditions(req, eqValues)
						return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
						// return this.store.queryMultipleObject('/api/v1/findAllMedSales/0', 'bind_course_region_goods_ym_sales', conditions)

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
					// TODO:
					// 由于接口返回的数据过慢，目前只好把竞品以PromiseAll的形式，
					// 换成一个一个请求。
					// 目前写成了固定了三个竞品。不符合以后的情况。
					.then(data => { // 获取竞品 firstObject折线图数据
						let competeProd = this.store.peekAll('medicine').filter((item) => {
							return item.compete;
						});

						let firstCompete = competeProd.firstObject;
						let req = this.store.createRecord('request', {
							res: 'bind_course_region_goods_ym_sales',
							fmcond: this.store.createRecord('fmcond', {
								skip: 0,
								take: 1000
							})
						});
						let eqValues = [
							{ type: 'eqcond', key: 'course_id', val: ids.courseid },
							{ type: 'eqcond', key: 'goods_id', val: firstCompete.id },
							{ type: 'gtecond', key: 'ym', val: '17-01' },
							{ type: 'ltecond', key: 'ym', val: '17-12' },
						]
						let conditions = _conditions(req, eqValues)
						// return this.store.queryMultipleObject('/api/v1/findAllMedSales/0', 'bind_course_region_goods_ym_sales', conditions)

						return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
					})
					.then(data => { // 获取竞品 secondObject折线图数据
						let competeProd = this.store.peekAll('medicine').filter((item) => {
							return item.compete;
						});

						let secondCompete = competeProd[1];
						let req = this.store.createRecord('request', {
							res: 'bind_course_region_goods_ym_sales',
							fmcond: this.store.createRecord('fmcond', {
								skip: 0,
								take: 1000
							})
						});
						let eqValues = [
							{ type: 'eqcond', key: 'course_id', val: ids.courseid },
							{ type: 'eqcond', key: 'goods_id', val: secondCompete.id },
							{ type: 'gtecond', key: 'ym', val: '17-01' },
							{ type: 'ltecond', key: 'ym', val: '17-12' },
						]
						let conditions = _conditions(req, eqValues)
						// return this.store.queryMultipleObject('/api/v1/findAllMedSales/0', 'bind_course_region_goods_ym_sales', conditions)

						return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
					})
					.then(data => { // 获取竞品 thirdObject折线图数据
						let competeProd = this.store.peekAll('medicine').filter((item) => {
							return item.compete;
						});

						let lastCompete = competeProd.lastObject;
						let req = this.store.createRecord('request', {
							res: 'bind_course_region_goods_ym_sales',
							fmcond: this.store.createRecord('fmcond', {
								skip: 0,
								take: 1000
							})
						});
						let eqValues = [
							{ type: 'eqcond', key: 'course_id', val: ids.courseid },
							{ type: 'eqcond', key: 'goods_id', val: lastCompete.id },
							{ type: 'gtecond', key: 'ym', val: '17-01' },
							{ type: 'ltecond', key: 'ym', val: '17-12' },
						]
						let conditions = _conditions(req, eqValues)
						// return this.store.queryMultipleObject('/api/v1/findAllMedSales/0', 'bind_course_region_goods_ym_sales', conditions)

						return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
					})
					/*
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
					*/
					.finally(() => {
						let that = this;
						let originLineData = [];

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
								originLineData.pushObject({
									name: record.prod_name,
									values
								});
							})
						}

						let medicineList = this.store.peekAll('bind_course_region_goods_ym_sales');
						// let outSeason = medicineList.forEach((item) => {
						// 	return item.ym.indexOf('q') < 0;
						// });
						let medicineAll = groupBy(medicineList.filter(elem => elem.region_id === 'all' && elem.ym.indexOf('q') < 0), 'goods_id');
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
								{ type: 'eqcond', key: 'region_id', val: elem.id },
								{ type: 'gtecond', key: 'ym', val: '17-01' },
								{ type: 'ltecond', key: 'ym', val: '17-12' },
							]
							let conditions = _conditions(req, eqValues)
							// return this.store.queryMultipleObject('/api/v1/findAllMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
							return this.store.queryMultipleObject('/api/v1/findMedSales/0', 'bind_course_region_goods_ym_sales', conditions)
						});
						return Promise.all(promiseArray)
					})
					/*
					.then(data => { // 处理cards数据
						let originRegionData = this.store.peekAll('region');
						regionBaseInfo.cards = [];
						let regionData = this.store.peekAll('bind_course_region_goods_ym_sales');
						originRegionData.forEach(elem => {
							let filtrerData = regionData.filter(felem => felem.region_id == elem.id);
							let sales = {};
							sales = filtrerData.find((item) => {
								return item.ym === "17-12";
							})
							// sales = filtrerData.lastObject;
							let allYearPotential = 0;
							filtrerData.forEach((item) => {
								allYearPotential += item.sales.potential;
							});
							sales.sales.set('allyearpotential', allYearPotential);
							// sales.sales.allyearpotential = allYearPotential;
							regionBaseInfo.cards.pushObject(sales)
						});
						return originRegionData;
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
								let id = key;
								let data = medicineArrayObject[key].map(elem => {
									return {
										key: elem.ym,
										value: elem.sales.sales,
										value2: (elem.sales.share * 100).toFixed(1)
									}
								});
								data.length = 12;
								data.sort((a, b) => {
									return a.key.slice(-2) - b.key.slice(-2);
								})
								return {
									region_id: id,
									data: data
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
					*/
					.finally(() => {
						let that = this;

						function d3Data(medicineArrayObject) {
							let medicineKeys = Object.keys(medicineArrayObject).sort();
							return medicineKeys.map(key => {
								let name = that.store.peekRecord('region', key).name;
								let values = medicineArrayObject[key].map(elem => {
									return {
										ym: elem.ym,
										value: elem.sales.share,
									}
								});
								values.length = 12;
								values.sort((a, b) => {
									return a.ym.slice(-2) - b.ym.slice(-2);
								})
								return {
									name: name,
									values: values
								}
								// return {
								// 	name: that.store.peekRecord('region', key).name,
								// 	values: medicineArrayObject[key].map(elem => {
								// 		return {
								// 			ym: elem.ym,
								// 			value: elem.sales.share,
								// 		}
								// 	})
								// }
							});

						}

						function tableData(arrayObjec) {
							let arrayKeys = Object.keys(arrayObjec).sort();
							return arrayKeys.map(key => {
								let decMonth = arrayObjec[key].find((item) => {
									return item.ym === "17-12"
								});
								let potential = decMonth.sales.potential.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.potential, 0).toFixed(2);
								let potential_contri = decMonth.sales.potential_contri.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.potential_contri, 0).toFixed(2);
								let sales = decMonth.sales.sales.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales, 0).toFixed(2);
								let sales_contri = decMonth.sales.sales_contri.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales_contri, 0).toFixed(2);
								let contri_index = decMonth.sales.contri_index.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.contri_index, 0).toFixed(2);
								let sales_growth = decMonth.sales.sales_growth.toFixed(2) //.reduce((acc, cur) => acc + cur.sales.sales_growth, 0).toFixed(2);
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
						let medicineByYm = medicineList.filter(elem => elem.ym !== '18-01' && elem.ym !== '18-02' && elem.ym !== '18-03');
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