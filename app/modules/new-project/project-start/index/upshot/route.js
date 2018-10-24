import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';

export default Route.extend({

	model() {
		this.store.peekAll('bind_course_region_rep').forEach(elem => elem.destroyRecord().then(rec => rec.unloadRecord()));

		let parentModel = this.modelFor('new-project.project-start');
		// let medicine = this.store.peekAll('medicine').filter(elem => !elem.compete).firstObject;
		function _conditions(request, anyConditions) {
			anyConditions.forEach((elem, index) => {
				request.get(elem.type).pushObject(request.store.createRecord(elem.type, {
					key: elem.key,
					val: elem.val,
				}))
			});
			return request.store.object2JsonApi('request', request);
		}

		let req = this.store.createRecord('callapmr', {
			paper_id: parentModel.paperid,
		});
		let conditions = this.store.object2JsonApi('callapmr', req);
		let modelData = {};

		return this.store.transaction('/api/v1/callAPMr/0', 'callapmr', conditions)
			.then(data => { // call R
				return data
			})
			.then(() => { // 获取公司产品
				let req = this.store.createRecord('request', {
					res: 'bind_course_goods',
					fmcond: this.store.createRecord('fmcond', {
						skip: 0,
						take: 20
					})
				});

				let eqValues = [{ type: 'eqcond', key: 'course_id', val: parentModel.courseid }]
				let conditions = _conditions(req, eqValues);

				return this.store.queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions)
			})
			.then(data => { // 处理公司产品
				data.forEach(elem => {
					elem.set('compete', false)
				});
				return data;
			}).then(data => { // 获取公司的竞品
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
						{ type: 'eqcond', key: 'course_id', val: parentModel.courseid },
						{ type: 'eqcond', key: 'goods_id', val: reval.id },
					]
					let conditions = _conditions(req, eqValues);
					return that.store.queryMultipleObject('/api/v1/findCompetGoods/0', 'medicine', conditions)
				});
				return Promise.all(promiseArray)
			})
			.then(() => {
				let medicine = this.store.peekAll('medicine').filter(elem => !elem.compete).firstObject;

				req = this.store.createRecord('request', { res: 'bind_course_goods_quarter_report' });

				let eqValues = [
					{ type: 'eqcond', key: 'course_id', val: parentModel.courseid },
					{ type: 'eqcond', key: 'goods_id', val: medicine.id }
				]
				eqValues.forEach((elem) => {
					req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
						key: elem.key,
						val: elem.val,
					}))
				});
				conditions = this.store.object2JsonApi('request', req);

				return this.store.queryObject('/api/v1/findQuarterReport/0', 'apmquarterreport', conditions)
			})
			.then(data => {
				modelData.quarterD3BarData = [
					{ id: 1, name: '最差结果', value: (data.worst_share * 100).toFixed(1) },
					{ id: 2, name: '上季结果', value: (data.pre_share * 100).toFixed(1) },
					{ id: 4, name: '最佳结果', value: (data.best_share * 100).toFixed(1) }
				];
				modelData.quarterTableData = [
					{ name: '最差结果', sales: data.worst_sales, share: (data.worst_share * 100).toFixed(1) },
					{ name: '上季结果', sales: data.pre_sales, share: (data.pre_share * 100).toFixed(1) },
					{ name: '最佳结果', sales: data.best_sales, share: (data.best_share * 100).toFixed(1) }
				]
				return data;
			})
			.then(data => {
				let medicineAll = this.store.peekAll('medicine');
				let promiseArray = medicineAll.map(medicine => {
					req = this.store.createRecord('request', {
						res: 'bind_paper_region_goods_ym_report',
						fmcond: this.store.createRecord('fmcond', {
							skip: 0,
							take: 1000
						})
					});
					let eqValues = [
						{ type: 'eqcond', key: 'goods_id', val: medicine.id }, //medicine.id
						{ type: 'eqcond', key: 'paper_id', val: parentModel.paperid }, //parentModel.paperid
						{ type: 'gtecond', key: 'ym', val: '17-q1' },
						{ type: 'ltecond', key: 'ym', val: '18-q1' },
					]
					eqValues.forEach((elem) => {
						req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
							key: elem.key,
							val: elem.val,
						}))
					});

					let conditions = this.store.object2JsonApi('request', req);
					return this.store.queryMultipleObject('/api/v1/findReportMedSales/0', 'bind_paper_region_goods_ym_report', conditions)
				})
				return Promise.all(promiseArray)
			})
			.then(data => {
				let companyMedicine = this.store.peekAll('medicine').find(elem => !elem.compete);
				let temData = [];
				data.forEach(x => x.forEach(r => temData.pushObject(r)))

				let that = this;
				let all = temData.filter(elem => elem.region_id === 'all')
				let region = temData.filter(elem => elem.region_id !== 'all');
				modelData.quarterD3BarData.pushObject({ id: 3, name: '本季结果', value: (all.filter(elem => elem.goods_id === companyMedicine.id && elem.ym === '18-q1').lastObject.apmreport.share * 100).toFixed(1) });
				modelData.quarterD3BarData = modelData.quarterD3BarData.sort(function(o1, o2) {
					return o1.id - o2.id
				})

				modelData.quarterTableData.pushObject({
					name: '本季结果',
					sales: all.filter(elem => elem.goods_id === companyMedicine.id && elem.ym === '18-q1').lastObject.apmreport.sales,
					share: (all.filter(elem => elem.goods_id === companyMedicine.id && elem.ym === '18-q1').lastObject.apmreport.share * 100).toFixed(1)
				});

				let tempByGroupGoods = groupBy(all, 'goods_id')
				modelData.areaD3LineShareData = Object.keys(tempByGroupGoods).map(key => {
					let goodCache = that.store.peekRecord('medicine', key);
					return {
						name: goodCache.prod_name,
						values: tempByGroupGoods[key].map((elem) => {
							return {
								ym: elem.ym,
								value: elem.apmreport.share
							}
						})
					}
				})

				let tempByGroupRegion = groupBy(region, 'region_id');
				modelData.areaD3LineRegionData = Object.keys(tempByGroupRegion).map(key => {
					let regionCache = that.store.peekRecord('region', key);
					return {
						name: regionCache.name,
						values: tempByGroupRegion[key].map(elem => {
							return {
								ym: elem.ym,
								value: elem.apmreport.share
							}
						})
					}
				}).reverse()
				return modelData
			})

	},
	actions: {

	}
});