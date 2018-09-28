import Component from '@ember/component';
import { computed } from '@ember/object';

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
		])
	},
	planPaire: computed('readyChoose.@each.isChecked', function() {
		let chooses = this.get('readyChoose');
		console.log('before deal');
		console.log(chooses);
		let planPaire = chooses.filterBy('isChecked', true);
		let dealPlan = planPaire;
		if (planPaire.length > 2) {
			let booleanChooses = chooses.map((choose) => {
				return choose.isChecked;
			});
			let index = booleanChooses.indexOf(true);
			Ember.set(chooses[index], 'isChecked', false);
			console.log('deal done');
			console.log(chooses);
			this.set('readyChoose', chooses);
			dealPlan.shift()
		};
		return dealPlan;
	}),
});