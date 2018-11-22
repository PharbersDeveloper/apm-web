import DS from 'ember-data';

export default DS.Model.extend({
    call_times_val: DS.attr('number'), // 拜访次数
    in_field_days_val: DS.attr('number'), // 实际工作天数
    motivation_val: DS.attr('number'), // 工作积极性
    prod_knowledge_val: DS.attr('number'), // 产品知识
    sales_skills_val: DS.attr('number'), // 销售能力
    target_call_freq_val: DS.attr('number'), // 目标拜访频次
    territory_manage_val: DS.attr('number'), // 区域管理能力
    target_occupation_val: DS.attr('number')
});
