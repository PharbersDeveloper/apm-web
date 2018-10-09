import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
    rep_name: DS.attr('string'),
    rep_image: DS.attr('string'),
    rep_level: DS.attr('string'),
    age: DS.attr('number'),
    education: DS.attr('string'),
    profe_bg: DS.attr('string'),
    service_year: DS.attr('number'),
    entry_time: DS.attr('number'),
    business_exp: DS.attr('string'),
    sales_skills_val: DS.attr('number'),
    prod_knowledge_val: DS.attr('number'),
    motivation_val: DS.attr('number'),
    territory_manage_val: DS.attr('number'),
    overall_val: DS.attr('number'),
    advantage: DS.attr('string'),
    weakness: DS.attr('string'),
    rep_describe: DS.attr('string'),
    feature: computed('age', 'education', 'profe_bg', 'service_year', 'entry_time', function() {
        return `${this.get('age')}岁 / ${this.get('education')} / ${this.get('profe_bg')} / ${this.get('service_year')}年工作经验 / 入职${this.get('entry_time')}年`
    }),
    advantage_c: computed('advantage', function() {
        let tempArray = this.get('advantage').split('#')
        return tempArray
    }),
    weakness_c: computed('weakness', function() {
        let tempArray = this.get('weakness').split('#')
        return tempArray
    }),
    pointCards: computed('prod_knowledge_val', 'territory_manage_val', 'sales_skills_val', 'motivation_val', function() {
        let tempArray = [
            {
                title: '产品知识',
                num: this.get('prod_knowledge_val')
            },
            {
                title: '区域规划管理能力',
                num: this.get('territory_manage_val')
            },
            {
                title: '销售能力',
                num: this.get('sales_skills_val')
            },
            {
                title: '销售积极性',
                num: this.get('motivation_val')
            },
        ]
        return tempArray 
    })
});
