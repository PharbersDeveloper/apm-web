import Route from '@ember/routing/route';

export default Route.extend({
    model() {
        return {
            // prod: "aaaa",
            // company: [{
            //     title: "ccc",
            // },{
            //     title: "bbb",
            // }],
            // line: {},
            medcine:'药品领域介绍',
            proList:[{
                img:'',
                title:'Britix',
                label:'公司产品',
                compete:true,
                factory:'Med Pharma',
                sort:'原研',
                des:'Britix是Med Pharma制药公司研发的新一代的心血管治疗药物 ，要求患者长期不间断使用；Britix对比于老一代产品与其他仿制药，它的疗效更加稳定，同时基于临床实验证明，Britix作为新一代的心血管治疗药物长期使用对于器官的损伤也相应较小；总体而言，Britix在心血管领域具有明显的优势，在整体市场上的表现正处于稳定上升期，公司也对此产品替代老一代心血管药物寄予厚望，但是Britx的定价比较高，除此之外，由于医生用药习惯尚未改变，对于新药的普及与认知度还有很大的提升空间。',
            },{
                img:'',
                title:'Swtiz',
                label:'竞品',
                factory:'Swat',
                sort:'原研',
                des:'Swat是一国际家知名的原研药公司，心血管慢性病领域中有着一个拳头产品Swtiz，是老一代的心血管药物，在以往，长期占据着心血管领域相当大的市场份额，但是，目前Swtiz 已经过了专利保护期，面对首国内首仿药“Norwa”，的冲击销售呈现下滑趋势，份额有明显的萎缩，Swat公司为缓解由于仿制药带来的市场冲击，已将Swtiz的定价有所下调；此外，最新的临床数据显示，它与另一类产品的联合使用能够有效降低患者发生某类心血管疾病的风险，同时由于上市较久，临床使用经验比较丰富，广受医生认可，Swat公司依然将此产品视为重要的核心产品，大量投入资源。',
            },{
                img:'',
                title:'Norwa',
                label:'竞品',
                factory:'Nennet',
                sort:'首仿',
                des:'Nennet是国内数一数二的仿制药公司，该公司的产品Norwa是Switiz的首仿药，刚刚通过了一致性评价，同时药品价格较低，对于长期服用者有较友好的价格优势，因此，近期表现十分强势，也对于原研药公司带来了很大的市场压力；Norwa的市场前景十分被看好，该公司预测，Norwa的销量将在未来2年内激增，抢占原研药Swtiz以往的份额，Nennet公司也在此投入了大量的资源，想借由一制性评价政策，提高Norwa的份额，',
            },{
                img:'',
                title:'Visas',
                label:'竞品',
                factory:'岭南制药',
                sort:'仿制药',
                des:'岭南制药是一家國內仿制药公司，其公司的产品一向以低价为其营销重点，在心血管领域的产品为Visas。该产品在某些特定地区，与一些支付能力比较低的地区，Visas的份额不算太低；但是由于其药物质量还未受大部分医生与患者的信任，它在整体市场中的份额很低。',
            },],
            lineChart:{
                title:"产品份额竞争趋势"
            }
        }
    }
});
