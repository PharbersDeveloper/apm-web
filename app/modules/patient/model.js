import DS from 'ember-data';

export default DS.Model.extend({
	patient_num: DS.attr('number'), // 疾病人数
	patient_num_contri: DS.attr('number'), // 疾病人数贡献度
});
