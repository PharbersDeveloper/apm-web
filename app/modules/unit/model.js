import DS from 'ember-data';

export default DS.Model.extend({
	potential: DS.attr('number'), // 潜力 、 市场规模
	potential_growth: DS.attr('number'), // 潜力增长
	potential_contri: DS.attr('number'), // 潜力贡献度
	unit: DS.attr('number'), // 销售量
	growth: DS.attr('number'), // 销售量增长率
	contri: DS.attr('number'), // 销售量贡献率
	contri_index: DS.attr('number'), // 销售量贡献度系数
	share: DS.attr('number'), // 销售量份额
	share_change: DS.attr('number'), // 销售量份额增长
	company_target: DS.attr('number'), // 销售量公司指标
	achieve_rate: DS.attr('number') // 销售量指标达成率
});
