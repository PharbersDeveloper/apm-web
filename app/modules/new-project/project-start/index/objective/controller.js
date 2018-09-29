import Controller from '@ember/controller';

export default Controller.extend({
	whichMonth: '1801',
	init() {
		this._super(...arguments);
		this.set('content', "测试数据<br>测试数据<br>测试数据");
		this.set('totalArea', [
			{ name: "区域A", value: 'A' },
			{ name: "区域B", value: 'B' },
			{ name: "区域C", value: 'C' },
			{ name: "区域D", value: 'D' },
			{ name: "区域E", value: 'E' },
			{ name: "区域F", value: 'F' },
			{ name: "区域G", value: 'G' },
		]);
	},

	actions: {
		openTips() {
			this.set('tipModal', true);
		},
		changeArea(value) {
			alert('Are you sure to change Area?');
		}
	}
});