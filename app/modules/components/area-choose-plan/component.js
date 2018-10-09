import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { later } from '@ember/runloop';

export default Component.extend({
	init() {
		this._super(...arguments);
		this.set('readyChoose', [
			{ text: "产品知识培训", isChecked: false },
			{ text: "销售技巧培训", isChecked: false },
			{ text: "接受高级别代表辅导", isChecked: false },
			{ text: "区域管理培训", isChecked: false },
			{ text: "销售奖励", isChecked: false },
			{ text: "目标设定培训", isChecked: false },
			{ text: "职业发展规划", isChecked: false },
			{ text: "谈话警告", isChecked: false },
			{ text: "经理协助KOL协访", isChecked: false },
			{ text: "回顾拜访计划", isChecked: false },
			{ text: "加强进药准入工作", isChecked: false },
			{ text: "对低级别代表进行辅导", isChecked: false },
		]);
	},
	getStore: computed('data', function() {
		// console.log(this.get('data').actionplan);
		let existPlan = this.get('data').actionplan.split(',').filter((item) => {
			return item.length > 0;
		});
		console.log(existPlan);
		let initChoose = this.get('readyChoose');
		initChoose.forEach((item) => {
			if (existPlan.length > 0) {
				existPlan.forEach((ele) => {
					if (item.text == ele) {
						set(item, 'isChecked', true)
					}
				})
			}
		});
		return this.get('data');
	}),
	planPaireComputed: computed('readyChoose.@each.isChecked', function() {
		let chooses = this.get('readyChoose');
		let planPaire = chooses.filterBy('isChecked', true);
		let checkedString = "";
		let currentId = this.get('getStore').id;
		let localStorageRegion = JSON.parse(localStorage.getItem('totalRegion'));

		if (planPaire.length > 2) {
			later(this, function() {
				set(planPaire.firstObject, 'isChecked', false)
				// planPaire.firstObject.set('isChecked', false)
				// planPaire.firstObject.set('text', planPaire.firstObject.get('text'))
				// console.info(planPaire);
				planPaire.forEach((item) => {
					if (item.isChecked) {
						checkedString = item.text + ',' + checkedString;
						this.get('getStore').set('actionplan', checkedString);
						let region = this.get('getStore').store.peekAll('region');
						let singleRegionJsonApi = null;
						let regionLocalStorage = region.map((item) => {
							singleRegionJsonApi = '';
							singleRegionJsonApi = this.get('getStore').store.object2JsonApi('region', item, false);
							return singleRegionJsonApi
						});
						localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage))
					}
				})
			}, 100);
		} else {
			planPaire.forEach((item) => {
				if (item.isChecked) {
					checkedString = item.text + ',' + checkedString;
					this.get('getStore').set('actionplan', checkedString);
					let region = this.get('getStore').store.peekAll('region');
					let singleRegionJsonApi = null;
					let regionLocalStorage = region.map((item) => {
						singleRegionJsonApi = '';
						singleRegionJsonApi = this.get('getStore').store.object2JsonApi('region', item, false);
						return singleRegionJsonApi
					});
					localStorage.setItem('totalRegion', JSON.stringify(regionLocalStorage))
				}
			})
		}
		return chooses;
	}),

});