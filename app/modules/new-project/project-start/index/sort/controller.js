import Controller from '@ember/controller';

export default Controller.extend({

	actions: {
		nextStep() {
			let resortRegion = JSON.parse(localStorage.getItem('regionResort'));
			let params = this.get('params');
			let isAllResort = resortRegion.every((item) => {
				return item.selected !== null
			});
			this.set('isAllResort', isAllResort);
			if (isAllResort) {
				this.set('tipsModal', true);
				this.set('tipsContent', '确认进入下一步后，将不可修改当前内容。');

				// let promiseArray = resortRegion.map((reg) => {
				// 	let req = this.store.createRecord('request', {
				// 		res: 'paperinput',
				// 	});
				// 	let eqValues = [
				// 		{ key: 'paper_id', type: 'eqcond', val: params.paperid },
				// 		{ key: 'region_id', type: 'eqcond', val: reg.selected.data.id },
				// 		{ key: 'sorting', type: 'upcond', val: reg.name }
				// 	];
				// 	eqValues.forEach((item) => {
				// 		req.get(item.type).pushObject(this.store.createRecord(item.type, {
				// 			key: item.key,
				// 			val: item.val,
				// 		}))
				// 	});
				// 	let jsonReq = this.store.object2JsonApi('request', req);
				// 	return this.store.transaction('/api/v1/answer/0', 'region', jsonReq)
				// });
				//
				// Promise.all(promiseArray).then((res) => {
				// 	this.set('tipsModal', true);
				// 	this.set('tipsContent', '确认进入下一步后，将不可修改当前内容。');
				// }).catch((error) => {
				// 	console.log(error);
				// });
				// this.set('tipsModal', true);
				// this.set('tipsContent', '确认进入下一步后，将不可修改当前内容');
			} else {
				// 弹窗提醒排序
				this.set('tipsModal', true);
				this.set('tipsContent', '请对所有的区域进行排序！');
			}
		},
		toObjective() {
			let resortRegion = JSON.parse(localStorage.getItem('regionResort'));
			let params = this.get('params');
			let promiseArray = resortRegion.map((reg) => {
				let req = this.store.createRecord('request', {
					res: 'paperinput',
				});
				let eqValues = [
					{ key: 'paper_id', type: 'eqcond', val: params.paperid },
					{ key: 'region_id', type: 'eqcond', val: reg.selected.data.id },
					{ key: 'sorting', type: 'upcond', val: reg.name }
				];
				eqValues.forEach((item) => {
					req.get(item.type).pushObject(this.store.createRecord(item.type, {
						key: item.key,
						val: item.val,
					}))
				});
				let jsonReq = this.store.object2JsonApi('request', req);
				return this.store.transaction('/api/v1/answer/0', 'region', jsonReq)
			});

			Promise.all(promiseArray).then((res) => {
				// this.set('tipsModal', true);
				// this.set('tipsContent', '确认进入下一步后，将不可修改当前内容。');
				this.transitionToRoute('new-project.project-start.index.objective')

			}).catch((error) => {
				console.log(error);
			});
			// this.transitionToRoute('new-project.project-start.index.objective')
		}
	}
});