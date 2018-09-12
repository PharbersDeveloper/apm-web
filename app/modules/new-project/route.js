import Route from '@ember/routing/route';

export default Route.extend({
    model() {
        return [
            {
                title:"地域计划培训课",
                time:""
            },{
                title:"目标管理计划培训课",
                time:"即将推出",
            },{
                title:"资源分配优化培训课",
                time:"即将推出"
            }
        ]
    }
});
