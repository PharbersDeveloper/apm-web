import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        close() {
            let transition = this.get('transition')
            console.info(transition)
            if (transition.urlMethod === null) {
                this.transitionToRoute('new-project.project-start.index.analyze')
            } else if (transition.urlMethod === 'update'){
                // this.transitionToRoute(transition.router.oldState.handlerInfos.lastObject.name)
            }
        }
    }
});
