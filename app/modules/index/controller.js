import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import loginModel from './login';

export default Controller.extend({
    email: null,
    password: null,
    login: computed(function () {
        return loginModel.create(
            getOwner(this).ownerInjection()
        );
    }),
    actions: {
        submit() {
            this.transitionToRoute('project-sort')
            // console.info(this.login.email)
            // console.info(this.login.password)
        }
    }
});
