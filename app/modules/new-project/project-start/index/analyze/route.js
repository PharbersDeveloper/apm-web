import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';

export default Route.extend({
	model() {
		let that = this;

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
		let regionList = this.store.peekAll('region');

		// TODO 这块有疑问 是所有区域还是只有本公司产品？
		let medicineByRegion = groupBy(medicineList.filter(elem => elem.region_id !== 'all'), 'region_id');
		// console.info(this.modelFor('new-project.project-start'));
		let paramsController = this.modelFor('new-project.project-start');
		this.controllerFor('new-project.project-start.index.analyze').set('params', paramsController);
		return {
			regionList,
			tableData: tableData(medicineByRegion)
		}
	}
});