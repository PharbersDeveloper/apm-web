import Route from '@ember/routing/route';

export default Route.extend({
    model() {
        return [
            {
                str:false,
                title:"地域计划培训课",
                time:"",
                num:0,
            },{
                str:true,
                title:"目标管理计划培训课",
                time:"即将推出",
                num:1
            },{
                str:true,
                title:"资源分配优化培训课",
                time:"即将推出",
                num:2
            }
        ]
    }
});
