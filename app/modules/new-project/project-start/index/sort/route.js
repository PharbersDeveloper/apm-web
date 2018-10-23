import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		let paramsController = this.modelFor('new-project.project-start');
		this.controllerFor('new-project.project-start.index.sort').set('params', paramsController);
		// 获取所有区域的负责代表
		let regionCache = JSON.parse(localStorage.getItem('totalRegion'));
		let promiseArray = regionCache.map(elem => {
			let req = this.store.createRecord('request', { res: 'bind_course_region_rep' });
			let eqValues = [
				{ type: 'eqcond', key: 'region_id', val: elem.data.id },
				{ type: 'eqcond', key: 'course_id', val: paramsController.courseid },
			]
			eqValues.forEach((elem) => {
				req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
					key: elem.key,
					val: elem.val,
				}))
			});
			let conditions = this.store.object2JsonApi('request', req);
			return this.store.queryMultipleObject('/api/v1/findRegionRep/0', 'representative', conditions)
		})
		return Promise.all(promiseArray)
			.then(data => { // 处理所有区域的负责代表
				let represents = [];
				data.forEach((elem, index) => {
					// 绑定区域与人员关系，方便缓存读取
					this.store.createRecord('bind_course_region_rep', {
						id: index,
						region_id: elem.query.included[0].attributes.val,
						represents: elem.map(x => x.id)
					})
					represents.pushObject({
						region_id: elem.query.included[0].attributes.val,
						rep_id: elem.firstObject.id,
						rep_name: elem.firstObject.rep_name
					})
				})
				this.controllerFor('new-project.project-start.index.sort').set('represents', represents);

				return represents
			}).then((data) => {
				return JSON.parse(localStorage.getItem('totalRegion'));
			})
		// return JSON.parse(localStorage.getItem('totalRegion'));
	}
});