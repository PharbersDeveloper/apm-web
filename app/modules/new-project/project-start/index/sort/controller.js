import Controller from '@ember/controller';

export default Controller.extend({

	actions: {
		nextStep() {
			let resortRegion = JSON.parse(localStorage.getItem('regionResort'));
			let isAllResort = resortRegion.every((item) => {
				return item.selected !== null
			});
			// console.log(isAllResort);
			this.set('isAllResort', isAllResort);
			if (isAllResort) {
				this.set('resortModal', true);
				this.set('resortMOdalContent', '确认进入下一步后，将不可修改当前内容');
			} else {
				// 弹窗提醒排序
				this.set('resortModal', true);
				this.set('resortMOdalContent', '请对所有的区域进行排序！');
			}
		},
		toObjective() {
			this.transitionToRoute('new-project.project-start.index.objective')
		}
	}
});