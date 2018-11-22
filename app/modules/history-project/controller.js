import Controller from '@ember/controller';
import rsvp from 'rsvp';

export default Controller.extend({
	loadInputData(paperid, courseid) {
		let paperReq = this.get('pmController').get('Store').createModel('request', {
			id: 'history0',
			res: 'paperinput'
		});
		paperReq.get('eqcond').pushObject(this.get('pmController').get('Store').createModel('eqcond', {
			id: 'historyeq0',
			key: 'paper_id',
			val: paperid,
		}))
		let paperConditions = this.get('pmController').get('Store').object2JsonApi(paperReq, false);

		let regionReq = this.get('pmController').get('Store').createModel('request', {
			id: 'history1',
			res: 'bind_course_region'
		});
		regionReq.get('eqcond').pushObject(this.get('pmController').get('Store').createModel('eqcond', {
			id: 'historyeq1',
			key: 'course_id',
			val: courseid,
		}))
		let regionConditions = this.get('pmController').get('Store').object2JsonApi(regionReq, false);

		let promistArray = [
			this.get('pmController').get('Store').queryMultipleObject('/api/v1/paperInputLst/0', 'paperinput', paperConditions),
			this.get('pmController').get('Store').queryMultipleObject('/api/v1/regionLst/0', 'region', regionConditions)
		]
		return rsvp.Promise.all(promistArray).then(data => {
			let paperArray = data[0];
			let regionArray = data[1];

			let step = paperArray.get('firstObject.paperinputstep.step')
			let regionResort = [];
			let totalRegion = []
			paperArray.forEach(paper => {
				let region = regionArray.find(elem => elem.get('id') === paper.get('region_id'))
				region.set('notes', paper.get('hint'))
				region.set('forecast', paper.get('predicted_target'))
				region.set('covisit', paper.get('field_work_days'))
				region.set('nationMeeting', paper.get('national_meeting'))
				region.set('cityMeeting', paper.get('city_meeting'))
				region.set('departmentMeeting', paper.get('depart_meeting'))
				region.set('actionplan', paper.get('action_plans').toString())
				let data = this.get('pmController').get('Store').object2JsonApi(region, false);
				totalRegion.pushObject(data)
				regionResort.pushObject({
					id: paper.get('sorting'),
					name: paper.get('sorting'),
					selected: {
						data: data.data,
						isDraggingObject: true
					}
				})
			});
			localStorage.setItem('regionResort', JSON.stringify(regionResort));
			localStorage.setItem('totalRegion', JSON.stringify(totalRegion));
			return step
		});
	},
	actions: {
		lookOver(paperid, courseid) {
			localStorage.setItem('history', false)
			this.loadInputData(paperid, courseid).then(data => {
				switch (data) {
					case 0:
						this.transitionToRoute('new-project.project-start.index.analyze', courseid, paperid)
						break;
					case 1:
						this.transitionToRoute('new-project.project-start.index.sort', courseid, paperid)
						break;
					case 2:
						this.transitionToRoute('new-project.project-start.index.objective', courseid, paperid)
						break;
					case 3:
						this.transitionToRoute('new-project.project-start.index.resource', courseid, paperid)
						break;
					case 4:
						this.transitionToRoute('new-project.project-start.index.action-plan', courseid, paperid)
						break;
					default:
						this.transitionToRoute('new-project.project-start.index.upshot', courseid, paperid)
				}
			})
		},
		continue (paperid, courseid) {
			this.loadInputData(paperid, courseid).then(() => {
				localStorage.setItem('history', true)
				this.transitionToRoute('new-project.project-start.index.analyze', courseid, paperid)
			})
		}
	}
});
