import Controller from '@ember/controller';
import rsvp from 'rsvp';

export default Controller.extend({
	init() {
		this._super(...arguments);
		this.set('history', JSON.parse(localStorage.getItem('history')));
	},
	actions: {
		nextStep() {
			let resortRegion = JSON.parse(localStorage.getItem('regionResort')) || [],
				isAllResort = resortRegion.every((item) => {
					return item.selected !== null && item.name !== ''
				});

			this.set('isAllResort', isAllResort);
			if (resortRegion.get('length') > 0 && isAllResort) {
				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '确认进入下一步后，将不可修改当前内容。',
					hintBtn: true,
				}
				this.set('hint', hint);
			} else {
				// 弹窗提醒排序
				let hint = {
					hintModal: true,
					hintImg: true,
					title: '提示',
					content: '请对所有的区域进行排序！',
					hintBtn: false,
				}
				this.set('hint', hint);
			}
		},
		toObjective() {
			let hint = {
				hintModal: false,
				hintImg: true,
				title: '提示',
				content: '确认进入下一步后，将不可修改当前内容。',
				hintBtn: true,
			},
				resortRegion = JSON.parse(localStorage.getItem('regionResort')),
				params = this.get('params'),
				req = null,
				eqValues = null,
				promiseArray = [],
				jsonReq = null;
			this.set('hint', hint);
			// let resortRegion = JSON.parse(localStorage.getItem('regionResort'));
			// let params = this.get('params');
			promiseArray = resortRegion.map((reg) => {
				req = this.get('pmController').get('Store').createModel('request', {
					id: reg.id + 'paperinput0',
					res: 'paperinput',
				});
				eqValues = [
					{ id: reg.id + '1', key: 'paper_id', type: 'eqcond', val: params.paperid },
					{ id: reg.id + '2', key: 'region_id', type: 'eqcond', val: reg.selected.data.id },
					{ id: reg.id + '3', key: 'sorting', type: 'upcond', val: reg.name }
				];
				eqValues.forEach((item) => {
					req.get(item.type).pushObject(this.get('pmController').get('Store').createModel(item.type, {
						id: item.id,
						key: item.key,
						val: item.val,
					}))
				});
				jsonReq = this.get('pmController').get('Store').object2JsonApi(req);
				return this.get('pmController').get('Store').transaction('/api/v1/answer/0', 'region', jsonReq)
			});

			rsvp.Promise.all(promiseArray).then(() => {
				this.transitionToRoute('new-project.project-start.index.objective')
			}).catch((error) => {
				this.get('logger').log(error);
			});
		}
	}
});
