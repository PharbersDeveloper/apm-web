import Controller from '@ember/controller';

export default Controller.extend({
    whichMonth: '1801',
    init() {
        this._super(...arguments);
        this.set('content', "测试数据<br>测试数据<br>测试数据");
    },
    actions: {
        openTips() {
            this.set('tipModal',true);
        }
    }
});
