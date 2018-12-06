import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		let projectDoing = [],
			projectDone = [],
			modelData = {};
		return this.store.queryMultipleObject('/api/v1/findAllPaper/0', 'paper', {})
			.then((data) => {
				data.forEach(ele => {
					if (ele.get('state')) {
						projectDoing.pushObject(ele)
					} else {
						projectDone.pushObject(ele)

					}
				});
				modelData.doing = projectDoing;
				modelData.done = projectDone;
				return modelData;

			})
	}
});