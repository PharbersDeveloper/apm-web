import Route from '@ember/routing/route';

export default Route.extend({
    model() {
        /**
         * 查询课程\场景 卡片
         */
        return this.store.queryMultipleObject('/api/v1/courseLst/0', 'course', {})
    }
});
