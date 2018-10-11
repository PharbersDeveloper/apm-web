import Controller from '@ember/controller';

export default Controller.extend({
	init() {
		this._super(...arguments);
		this.chooseData = [{
			name: "产品A",
			values: [
				{ ym: "17-q1", value: 190, },
				{ ym: "17-q2", value: 180, },
				{ ym: "17-q3", value: 190, },
				{ ym: "17-q4", value: 160, },
				{ ym: "18-q5", value: 160, }
			]
		}, {
			name: "竞品A",
			values: [
                { ym: "17-q1", value: 150, },
				{ ym: "17-q2", value: 121, },
				{ ym: "17-q3", value: 140, },
				{ ym: "17-q4", value: 160, },
				{ ym: "18-q5", value: 30, },
			]
		}];
		this.sectionData = [{
			name: "区域A",
			values: [{ ym: "17-q1", value: 190, },
                { ym: "17-q2", value: 180, },
                { ym: "17-q3", value: 190, },
                { ym: "17-q4", value: 160, },
                { ym: "18-q5", value: 160, }
			]
		}, {
			name: "区域B",
			values: [{ ym: "17-q1", value: 150, },
                { ym: "17-q2", value: 160, },
                { ym: "17-q3", value: 140, },
                { ym: "17-q4", value: 160, },
                { ym: "18-q5", value: 30, },
			]
		}]
	},
});