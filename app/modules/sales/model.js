import DS from 'ember-data';

export default DS.Model.extend({
    potential: DS.attr('number'), // 潜力 、 市场规模
    potential_growth: DS.attr('number'), // 潜力增长
    potential_contri: DS.attr('number'), // 潜力贡献度
    sales: DS.attr('number'), // 销售额
    sales_growth: DS.attr('number'), // 销售增长
    sales_contri: DS.attr('number'), // 销售贡献度
    contri_index: DS.attr('number'), // 贡献度系数
    share: DS.attr('number'), // 份额
    share_change: DS.attr('number'), // 份额增长
    company_target: DS.attr('number'), // 公司指标
    achieve_rate: DS.attr('number') // 指标达成率
});
