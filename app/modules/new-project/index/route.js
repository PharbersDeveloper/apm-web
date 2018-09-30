import Route from '@ember/routing/route';

export default Route.extend({
    model() {
        
        /**
         * 查询缓存，因父路由总会请求数据，所以需要担心数据的刷新问题
         */
        return this.store.peekAll('course');
    }
});
