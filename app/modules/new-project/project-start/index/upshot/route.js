import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';

export default Route.extend({
	init() {
		this._super(...arguments);
		this.set('history', JSON.parse(localStorage.getItem('history')));
	},
	_callScalaR(that, parentModel) {
		let req = that.get('pmController').get('Store').createModel('request', {
			id: 'callScalaR0',
			res: 'paperinput',
			// paper_id: parentModel.paperid,
		});
		req.get('eqcond').pushObject(that.get('pmController').get('Store').createModel('eqcond', {
			id: 'callScalaR1',
			key: 'paper_id',
			val: parentModel.paperid
		}))
		let conditions = that.get('pmController').get('Store').object2JsonApi(req);
		return that.get('pmController').get('Store').transaction('/api/v1/apmCalc/0', 'callapmr', conditions)
			.then(data => { // call R
				return data;
			})
			.catch(error => {
				let content = "";
				error.errors.forEach(ele => {
					content += ele.detail + '</br>'
				});
				let hint = {
					hintModal: true,
					hintImg: true,
					title: "提示",
					content: content,
					hintBtn: false,
				}
				this.set('hint', hint);
			})
	},
	model() {
		this.get('pmController').get('Store').peekAll('bind_course_region_rep').forEach(elem => elem.destroyRecord().then(rec => rec.unloadRecord()));

		let parentModel = this.modelFor('new-project.project-start');

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

		function _callR(that) {
			let req = that.get('pmController').get('Store').createModel('callapmr', {
				id: 'callR0',
				paper_id: parentModel.paperid,
			});
			let conditions = that.get('pmController').get('Store').object2JsonApi(req, false);
			return that.get('pmController').get('Store').transaction('/api/v1/callAPMr/0', 'callapmr', conditions)
				.then(data => { // call R
					return data;
				})
		};
		/*
				let req = this.get('pmController').get('Store').createModel('callapmr', {
					id: 'callR0',
					paper_id: parentModel.paperid,
				});
				let conditions = this.get('pmController').get('Store').object2JsonApi(req, false);
				let modelData = {};

				return this.get('pmController').get('Store').transaction('/api/v1/callAPMr/0', 'callapmr', conditions)
					.then(data => { // call R
						return data;
					})
					.then(() => { // 获取公司产品
					*/
		let modelData = {};
		let req = this.get('pmController').get('Store').createModel('request', {
			id: 'upshotProd0',
			res: 'bind_course_goods',
			fmcond: this.get('pmController').get('Store').createModel('fmcond', {
				id: 'upshotProdFm0',
				skip: 0,
				take: 20
			})
		});

		let eqValues = [{ id: 'upshotProd1', type: 'eqcond', key: 'course_id', val: parentModel.courseid }];
		let conditions = _conditions(req, eqValues);
		// 获取公司产品
		return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findCourseGoods/0', 'medicine', conditions)
			// })
			.then(data => { // 处理公司产品
				data.forEach(elem => {
					elem.set('compete', false)
				});
				return data;
			})
			.then(data => { // 获取公司的竞品
				let that = this;
				let promiseArray = data.map(reval => {
					let req = this.get('pmController').get('Store').createRecord('request', {
						id: 'upshotCompete0',
						res: 'bind_course_goods_compet',
						fmcond: this.get('pmController').get('Store').createRecord('fmcond', {
							id: 'upshotCompeteFm0',
							skip: 0,
							take: 20
						})
					});
					let eqValues = [
						{ id: 'upshotCompete1', type: 'eqcond', key: 'course_id', val: parentModel.courseid },
						{ id: 'upshotCompete2', type: 'eqcond', key: 'goods_id', val: reval.id },
					]
					let conditions = _conditions(req, eqValues);
					return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findCompetGoods/0', 'medicine', conditions)
				});
				return Promise.all(promiseArray)
			})
			.then(() => {
				let history = this.get('history');
				let that = this;
				if (!history) {
					return this._callScalaR(that, parentModel)
				} else {
					return null;
				}
			})
			.then(() => {
				let medicine = this.get('pmController').get('Store').peekAll('medicine').filter(elem => !elem.compete).firstObject;

				req = this.get('pmController').get('Store').createModel('request', {
					id: 'upshotMedicine0',
					res: 'bind_course_goods_quarter_report'
				});

				let eqValues = [
					{ id: 'upshotMedicine1', type: 'eqcond', key: 'course_id', val: parentModel.courseid },
					{ id: 'upshotMedicine2', type: 'eqcond', key: 'goods_id', val: medicine.id }
				]
				eqValues.forEach((elem) => {
					req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, {
						id: elem.id,
						key: elem.key,
						val: elem.val,
					}))
				});
				conditions = this.get('pmController').get('Store').object2JsonApi(req);

				return this.get('pmController').get('Store').queryObject('/api/v1/findQuarterReport/0', 'apmquarterreport', conditions)
			})
			.then(data => {
				modelData.quarterD3BarData = [
					{ id: 1, name: '最差结果', value: (data.worst_share * 100).toFixed(1) },
					{ id: 2, name: '上季结果', value: (data.pre_share * 100).toFixed(1) },
					{ id: 4, name: '最佳结果', value: (data.best_share * 100).toFixed(1) }
				];
				modelData.quarterTableData = [
					{ name: '最差结果', sales: data.worst_unit, share: (data.worst_share * 100).toFixed(1) },
					{ name: '上季结果', sales: data.pre_unit, share: (data.pre_share * 100).toFixed(1) },
					{ name: '最佳结果', sales: data.best_unit, share: (data.best_share * 100).toFixed(1) }
				]
				return data;
			})
			.then(data => {
				let medicineAll = this.get('pmController').get('Store').peekAll('medicine');
				let promiseArray = medicineAll.map(medicine => {
					req = this.get('pmController').get('Store').createModel('request', {
						id: medicine.id + 'upshotMedicine00',
						res: 'bind_paper_region_goods_time_report',
						fmcond: this.get('pmController').get('Store').createModel('fmcond', {
							id: medicine.id + 'upshotMedicine01',
							skip: 0,
							take: 1000
						})
					});
					let eqValues = [
						{ id: medicine.id + 'upshotMedicine06', type: 'eqcond', key: 'time_type', val: 'season' },
						{ id: medicine.id + 'upshotMedicine02', type: 'eqcond', key: 'goods_id', val: medicine.id }, //medicine.id
						{ id: medicine.id + 'upshotMedicine03', type: 'eqcond', key: 'paper_id', val: parentModel.paperid }, //parentModel.paperid
						// { id: medicine.id + 'upshotMedicine04', type: 'gtecond', key: 'time', val: '17-q1' },
						{ id: medicine.id + 'upshotMedicine05', type: 'eqcond', key: 'time', val: '18-q1' },
					]
					eqValues.forEach((elem) => {
						req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, {
							id: elem.id,
							key: elem.key,
							val: elem.val,
						}))
					});

					let conditions = this.get('pmController').get('Store').object2JsonApi(req);
					return this.get('pmController').get('Store').queryMultipleObject('/api/v1/findAllReportMedUnit/0', 'bind_paper_region_goods_time_report', conditions)
				})
				return Promise.all(promiseArray)
			})
			.then(data => {
				let companyMedicine = this.get('pmController').get('Store').peekAll('medicine').find(elem => !elem.compete);
				let temData = [];
				data.forEach(x => x.forEach(r => {
					if (r.time.indexOf('NA') < 0) {
						temData.pushObject(r)
					}
				}));

				let that = this;
				let all = temData.filter(elem => elem.region_id === 'all')
				let region = temData.filter(elem => elem.region_id !== 'all');
				modelData.quarterD3BarData.pushObject({ id: 3, name: '本季结果', value: (all.filter(elem => elem.goods_id === companyMedicine.id).lastObject.apmreport.share * 100).toFixed(1) });
				modelData.quarterD3BarData = modelData.quarterD3BarData.sort(function(o1, o2) {
					return o1.id - o2.id
				})
				modelData.quarterTableData.pushObject({
					name: '本季结果',
					sales: all.filter(elem => elem.goods_id === companyMedicine.id && elem.region_id === 'all').lastObject.apmreport.unit,
					share: (all.filter(elem => elem.goods_id === companyMedicine.id && elem.region_id === 'all').lastObject.apmreport.share * 100).toFixed(1)
				});

				let prodForRegionidIsAll = all.map(item => {
					return {
						goods_id: item.goods_id,
						time: item.time,
						share: item.apmreport.share,
					}
				});
				let regionForProdIsOwn = region.map(item => {
					return {
						goods_id: item.goods_id,
						region_id: item.region_id,
						time: item.time,
						share: item.apmreport.share,
					}
				})

				this.set('allProdAndAllRegion', {
					all: prodForRegionidIsAll,
					region: regionForProdIsOwn,
					companyProd: companyMedicine,
				})
				return null;
			})
			.then(() => { // 查询产品季度数据
				let req = this.get('pmController').get('Store').createModel('request', {
					id: 'objectiveCompete0',
					res: 'bind_course_region_goods_time_unit',
					fmcond: this.get('pmController').get('Store').createModel('fmcond', {
						id: 'objectiveCompeteFm1',
						skip: 0,
						take: 1000
					})
				});

				let eqValues = [
					{ id: 'objectiveCompete5', type: 'eqcond', key: 'time_type', val: 'season' },
					{ id: 'ibkectiveCOmpete2', type: 'eqcond', key: 'region_id', val: 'all' },
					{ id: 'objectiveCompete1', type: 'eqcond', key: 'course_id', val: parentModel.courseid },
					{ id: 'objectiveCompete3', type: 'gtecond', key: 'time', val: '17-q1' },
					{ id: 'objectiveCompete4', type: 'ltecond', key: 'time', val: '17-q4' }
				];

				eqValues.forEach(elem => {
					req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, { id: elem.id, key: elem.key, val: elem.val }))
				});
				let conditions = this.get('pmController').get('Store').object2JsonApi(req);
				return this.get('pmController').get('Store')
					.queryMultipleObject('/api/v1/findAllMedUnit/0', 'bind_course_region_goods_time_unit', conditions);
			})
			.then((data) => { // 处理产品季度数据
				let all = this.get('allProdAndAllRegion').all;
				data.forEach(ele => {
					all.pushObject({
						goods_id: ele.goods_id,
						time: ele.time,
						share: ele.unit.share,
					});
				});
				let tempByGroupGoods = groupBy(all, 'goods_id');
				let _areaD3LineShareData = Object.keys(tempByGroupGoods).map(key => {
					let goodCache = this.get('pmController').get('Store').peekRecord('medicine', key);
					return {
						name: goodCache.prod_name,
						values: tempByGroupGoods[key].map((elem) => {
							return {
								ym: elem.time,
								value: elem.share
							}
						})
					}
				});
				_areaD3LineShareData.forEach(ele => {
					ele.values.sort((a, b) => {
						return (a.ym.slice(0, 2) + a.ym.slice(-1)) - (b.ym.slice(0, 2) + b.ym.slice(-1))
					})
				});

				modelData.areaD3LineShareData = _areaD3LineShareData;
				return null;
			})
			.then(() => { // 查询本公司产品区域季度数据
				let companyProd = this.get('allProdAndAllRegion').companyProd;
				let req = this.get('pmController').get('Store').createModel('request', {
					id: 'objectiveCompete0',
					res: 'bind_course_region_goods_time_unit',
					fmcond: this.get('pmController').get('Store').createModel('fmcond', {
						id: 'objectiveCompeteFm1',
						skip: 0,
						take: 1000
					})
				});

				let eqValues = [
					{ id: 'objectiveCompete5', type: 'eqcond', key: 'time_type', val: 'season' },
					{ id: 'objectiveCompete2', type: 'necond', key: 'region_id', val: 'all' },
					{ id: 'objectiveCompete6', type: 'eqcond', key: 'goods_id', val: companyProd.id },
					{ id: 'objectiveCompete1', type: 'eqcond', key: 'course_id', val: parentModel.courseid },
					{ id: 'objectiveCompete3', type: 'gtecond', key: 'time', val: '17-q1' },
					{ id: 'objectiveCompete4', type: 'ltecond', key: 'time', val: '17-q4' }
				];

				eqValues.forEach(elem => {
					req.get(elem.type).pushObject(this.get('pmController').get('Store').createModel(elem.type, { id: elem.id, key: elem.key, val: elem.val }))
				});
				let conditions = this.get('pmController').get('Store').object2JsonApi(req);
				return this.get('pmController').get('Store')
					.queryMultipleObject('/api/v1/findAllMedUnit/0', 'bind_course_region_goods_time_unit', conditions);
			})
			.then((data) => { // 处理本公司产品所有区域的季度数据
				let region = this.get('allProdAndAllRegion').region;
				data.forEach(ele => {
					region.pushObject({
						goods_id: ele.goods_id,
						region_id: ele.region_id,
						time: ele.time,
						share: ele.unit.share,
					});
				});
				let tempByGroupRegion = groupBy(region, 'region_id');

				let _areaD3LineRegionData = Object.keys(tempByGroupRegion).map(key => {
					let regionCache = this.get('pmController').get('Store').peekRecord('region', key);
					return {
						name: regionCache.name,
						values: tempByGroupRegion[key].map(elem => {
							return {
								ym: elem.time,
								value: elem.share
							}
						})
					}
				});
				_areaD3LineRegionData.forEach(ele => {
					ele.values.sort((a, b) => {
						return (a.ym.slice(0, 2) + a.ym.slice(-1)) - (b.ym.slice(0, 2) + b.ym.slice(-1))
					})
				});
				modelData.areaD3LineRegionData = _areaD3LineRegionData.reverse();
				return modelData;
			})
	},
});
