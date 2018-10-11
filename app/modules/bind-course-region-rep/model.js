import DS from 'ember-data';

/**
 * 该model 表示  区域与代表额绑定关系，返回数据因没有这层关系，但又不想再次请求，所以加了这个model
 */
export default DS.Model.extend({
    region_id: DS.attr('string'),
    represents: DS.attr()
});
