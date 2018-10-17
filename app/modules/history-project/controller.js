import Controller from '@ember/controller';

export default Controller.extend({
    loadInputData(paperid, courseid) {
        let paperReq = this.store.createRecord('request', { res: 'paperinput' });
        paperReq.get('eqcond').pushObject(this.store.createRecord('eqcond', {
            key: 'paper_id',
            val: paperid,
        }))
        let paperConditions = this.store.object2JsonApi('request', paperReq);

        let regionReq = this.store.createRecord('request', { res: 'bind_course_region' });
        regionReq.get('eqcond').pushObject(this.store.createRecord('eqcond', {
            key: 'course_id',
            val: courseid,
        }))
        let regionConditions = this.store.object2JsonApi('request', regionReq);

        let promistArray = [
            this.store.queryMultipleObject('/api/v1/paperInputLst/0', 'paperinput', paperConditions),
            this.store.queryMultipleObject('/api/v1/regionLst/0', 'region', regionConditions)
        ]
        return Promise.all(promistArray).then(data => {
            let paperArray = data[0];
            let regionArray = data[1];

            let step = paperArray.firstObject.paperinputstep.step
            let regionResort = [];
            let totalRegion = []
            paperArray.forEach(paper => {
                let region = regionArray.find(elem => elem.id === paper.region_id)
                region.set('notes', paper.hint)
                region.set('forecast', paper.predicted_target)
                region.set('covisit', paper.field_work_days)
                region.set('nationMeeting', paper.national_meeting)
                region.set('cityMeeting', paper.city_meeting)
                region.set('departmentMeeting', paper.depart_meeting)
                region.set('actionplan', paper.action_plans.toString())
                let data = this.store.object2JsonApi('region', region, false);
                totalRegion.pushObject(data)
                regionResort.pushObject({
                    id: paper.sorting,
                    name: paper.sorting,
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
                switch(data) {
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
        continue(paperid, courseid) {
            this.loadInputData(paperid, courseid).then(() =>{
                localStorage.setItem('history', true)
                this.transitionToRoute('new-project.project-start.index.analyze', courseid, paperid)
            })
        }
    }
});
