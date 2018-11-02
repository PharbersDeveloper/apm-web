import Mixin from '@ember/object/mixin';

export default Mixin.create({
    signUpSuccess(data,url) {
        let jsonstr = JSON.stringify(data.serialize());
        if(data.status === "error") {
        }
    }
});
