import Route from '@ember/routing/route';
import { groupBy } from '../../../../phtool/tool';

export default Route.extend({
    loadD3Data() {
        let radarCache = this.store.peekAll('bind_course_region_radar');
        let radarArray = radarCache.filter(elem => elem.region_id !== 'ave');
        let ave = radarCache.find(elem => elem.region_id === 'ave');
        function axes(radarfigure) {
            let axes = [];
            axes.push({
                axis: '产品知识',
                value: radarfigure.prod_knowledge_val
            })

            axes.push({
                axis: '目标拜访频次',
                value: radarfigure.target_call_freq_val
            })

            axes.push({
                axis: '拜访次数',
                value: radarfigure.call_times_val
            })

            axes.push({
                axis: '实际工作天数',
                value: radarfigure.in_field_days_val
            })

            axes.push({
                axis: '工作积极性',
                value: radarfigure.motivation_val
            })

            axes.push({
                axis: '区域管理能力',
                value: radarfigure.territory_manage_val
            })

            axes.push({
                axis: '销售能力',
                value: radarfigure.sales_skills_val
            })
            return axes
        }
        return radarArray.map(elem => {
            let regionCache = this.store.peekRecord('region', elem.region_id);
            return {
                region_id: elem.region_id,
                data: [
                    {
                        name: '区域平均',
                        axes: axes(ave.radarfigure),
                        color: '#762712'
                    },
                    {
                        name: regionCache.name,
                        axes: axes(elem.radarfigure),
                        color: '#26AF32'
                    }
                ]
            }
        });
    },
	model() {
        let paramsController = this.modelFor('new-project.project-start');
        let controller = this.controllerFor('new-project.project-start.index.action-plan')
        let regionCahe = this.store.peekAll('region');
        let bind_course_region_repCache = this.store.peekAll('bind_course_region_rep')
        let representsCache = this.store.peekAll('representative');
        let goodsByRegion = groupBy(this.store.peekAll('bind-course-region-goods-ym-sales').filter(elem => elem.region_id !== 'all'), 'region_id')
        let areaReps = bind_course_region_repCache.map(elem => {
            return {
                region_id: elem.region_id,
                data: elem.represents.map(ele => representsCache.find(x => x.id === ele).rep_name)
            }            
        })
        let regionCompanyTargets = Object.keys(goodsByRegion).map(key => {
            return {
                region_id: key,
                company_targe: goodsByRegion[key].lastObject.sales.company_target
            }
        })
        controller.set('areaReps', areaReps)
        controller.set('regionCompanyTargets', regionCompanyTargets)

        let d3Data = this.loadD3Data();
        controller.set('params', paramsController);
        controller.set('radarData', d3Data.find(elem => elem.region_id === regionCahe.firstObject.id).data);
        controller.set('areaRadars', d3Data);
        controller.set('regionResort', JSON.parse(localStorage.getItem('regionResort')));
		return regionCahe;
	},
	actions: {

	}
});