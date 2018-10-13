import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';

export default Route.extend({

	model() {
		let parentModel = this.modelFor('new-project.project-start');
		let medicine = this.store.peekAll('medicine').filter(elem => !elem.compete).firstObject;
		let req = this.store.createRecord('request', { res: 'bind_course_goods_quarter_report' });

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
		let conditions = this.store.object2JsonApi('request', req);
		let modelData = {};
		return this.store.queryObject('/api/v1/findQuarterReport/0', 'apmquarterreport', conditions).
		then(data => {
			modelData.quarterD3BarData = [
				{ id: 1, name: '最差结果', value: data.worst_share },
				{ id: 2, name: '上季结果', value: data.pre_share },
				{ id: 4, name: '最佳结果', value: data.best_share }
			];
			modelData.quarterTableData = [
				{ name: '最差结果', sales: data.worst_sales, share: (data.worst_share * 100).toFixed(1) },
				{ name: '上季结果', sales: data.pre_sales, share: (data.pre_share * 100).toFixed(1) },
				{ name: '最佳结果', sales: data.best_sales, share: (data.best_share * 100).toFixed(1) }
			]
			return data;
		}).
		then(data => {
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
					{ type: 'eqcond', key: 'paper_id', val: '5bc04a3afaf85b0001069a64' }, //parentModel.paperid
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
		}).
		then(data => {
			let temData = [];
			data.forEach(x => x.forEach(r => temData.pushObject(r)))

			let that = this;
			let all = temData.filter(elem => elem.region_id === 'all');
			let region = temData.filter(elem => elem.region_id !== 'all');
			modelData.quarterD3BarData.pushObject({ id: 3, name: '本季结果', value: (all.lastObject.apmreport.share).toFixed(1) });
			modelData.quarterD3BarData = modelData.quarterD3BarData.sort(function(o1, o2) {
				return o1.id - o2.id
			})

			modelData.quarterTableData.pushObject({ name: '本季结果', sales: all.lastObject.apmreport.sales, share: all.lastObject.apmreport.share });

			let tempByGroupGoods = groupBy(all, 'goods_id')
			modelData.areaD3LineShareData = Object.keys(tempByGroupGoods).map(key => {
				let goodCache = that.store.peekRecord('medicine', key);
				return {
					name: goodCache.corp_name,
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
			})
			return modelData
		})
	},
	actions: {

	}
});