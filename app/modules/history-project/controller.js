import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        lookOver(paperid, courseid) {
            let req = this.store.createRecord('request', { res: 'paperinput' });
			let eqValues = [
				{ type: 'eqcond', key: 'paper_id', val: paperid },
			]
			eqValues.forEach((elem) => {
				req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
					key: elem.key,
					val: elem.val,
				}))
			});
            let conditions = this.store.object2JsonApi('request', req);
            
            this.store.queryMultipleObject('/api/v1/paperInputLst/0', 'paperinput', conditions).then(data => {
                console.info(data)
            })
        },
        continue(paperid, courseid) {
            localStorage.setItem('history', true)
            console.info(paperid)
        }
    }
});
