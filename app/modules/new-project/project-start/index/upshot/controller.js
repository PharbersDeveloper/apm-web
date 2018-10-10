import Controller from '@ember/controller';

export default Controller.extend({
	init() {
		this._super(...arguments);
		this.chooseData = [{
			name: "产品A",
			values: [{ ym: "18-01", value: 50, },
				{ ym: "18-02", value: 190, },
				{ ym: "18-03", value: 180, },
				{ ym: "18-04", value: 190, },
				{ ym: "18-05", value: 160, },
				{ ym: "18-06", value: 160, },
				{ ym: "18-07", value: 142, },
				{ ym: "18-08", value: 180, },
				{ ym: "18-09", value: 110, },
				{ ym: "18-10", value: 140, },
				{ ym: "18-11", value: 55, },
				{ ym: "18-12", value: 120, }
			]
		}, {
			name: "竞品A",
			values: [{ ym: "18-01", value: 150, },
				{ ym: "18-02", value: 160, },
				{ ym: "18-03", value: 121, },
				{ ym: "18-04", value: 140, },
				{ ym: "18-05", value: 160, },
				{ ym: "18-06", value: 30, },
				{ ym: "18-07", value: 170, },
				{ ym: "18-08", value: 130, },
				{ ym: "18-09", value: 160, },
				{ ym: "18-10", value: 130, },
				{ ym: "18-11", value: 75, },
				{ ym: "18-12", value: 130, }
			]
		}, {
			name: "竞品B",
			values: [{ ym: "18-01", value: 250, unit: '' },
				{ ym: "18-02", value: 260, unit: '' },
				{ ym: "18-03", value: 240, unit: '' },
				{ ym: "18-04", value: 240, unit: '' },
				{ ym: "18-05", value: 260, unit: '' },
				{ ym: "18-06", value: 230, unit: '' },
				{ ym: "18-07", value: 270, unit: '' },
				{ ym: "18-08", value: 230, unit: '' },
				{ ym: "18-09", value: 260, unit: '' },
				{ ym: "18-10", value: 230, unit: '' },
				{ ym: "18-11", value: 175, unit: '' },
				{ ym: "18-12", value: 230, unit: '' }
			]
		}];
		this.sectionData = [{
			name: "区域A",
			values: [{ ym: "18-01", value: 50, unit: '' },
				{ ym: "18-02", value: 10, unit: '' },
				{ ym: "18-03", value: 12, unit: '' },
				{ ym: "18-04", value: 11, unit: '' },
				{ ym: "18-05", value: 16, unit: '' },
				{ ym: "18-06", value: 19, unit: '' },
				{ ym: "18-07", value: 22, unit: '' },
				{ ym: "18-08", value: 40, unit: '' },
				{ ym: "18-09", value: 36, unit: '' },
				{ ym: "18-10", value: 45, unit: '' },
				{ ym: "18-11", value: 55, unit: '' },
				{ ym: "18-12", value: 31, unit: '' }
			]
		}, {
			name: "区域B",
			values: [{ ym: "18-01", value: 50, },
				{ ym: "18-02", value: 56, },
				{ ym: "18-03", value: 26, },
				{ ym: "18-04", value: 19, },
				{ ym: "18-05", value: 36, },
				{ ym: "18-06", value: 30, },
				{ ym: "18-07", value: 27, },
				{ ym: "18-08", value: 26, },
				{ ym: "18-09", value: 19, },
				{ ym: "18-10", value: 23, },
				{ ym: "18-11", value: 16, },
				{ ym: "18-12", value: 23, }
			]
		}, {
			name: "区域C",
			values: [{ ym: "18-01", value: 18, },
				{ ym: "18-02", value: 26, },
				{ ym: "18-03", value: 37, },
				{ ym: "18-04", value: 50, },
				{ ym: "18-05", value: 36, },
				{ ym: "18-06", value: 51, },
				{ ym: "18-07", value: 42, },
				{ ym: "18-08", value: 16, },
				{ ym: "18-09", value: 52, },
				{ ym: "18-10", value: 36, },
				{ ym: "18-11", value: 41, },
				{ ym: "18-12", value: 25, }
			]
		}, {
			name: "区域D",
			values: [{ ym: "18-01", value: 35, },
				{ ym: "18-02", value: 56, },
				{ ym: "18-03", value: 45, },
				{ ym: "18-04", value: 36, },
				{ ym: "18-05", value: 15, },
				{ ym: "18-06", value: 28, },
				{ ym: "18-07", value: 35, },
				{ ym: "18-08", value: 56, },
				{ ym: "18-09", value: 27, },
				{ ym: "18-10", value: 42, },
				{ ym: "18-11", value: 25, },
				{ ym: "18-12", value: 10, }
			]
		}, {
			name: "区域E",
			values: [{ ym: "18-01", value: 46, },
				{ ym: "18-02", value: 44, },
				{ ym: "18-03", value: 47, },
				{ ym: "18-04", value: 62, },
				{ ym: "18-05", value: 18, },
				{ ym: "18-06", value: 35, },
				{ ym: "18-07", value: 45, },
				{ ym: "18-08", value: 19, },
				{ ym: "18-09", value: 26, },
				{ ym: "18-10", value: 44, },
				{ ym: "18-11", value: 56, },
				{ ym: "18-12", value: 42, }
			]
		}, {
			name: "区域E",
			values: [{ ym: "18-01", value: 52, },
				{ ym: "18-02", value: 34, },
				{ ym: "18-03", value: 41, },
				{ ym: "18-04", value: 42, },
				{ ym: "18-05", value: 48, },
				{ ym: "18-06", value: 15, },
				{ ym: "18-07", value: 35, },
				{ ym: "18-08", value: 29, },
				{ ym: "18-09", value: 40, },
				{ ym: "18-10", value: 34, },
				{ ym: "18-11", value: 26, },
				{ ym: "18-12", value: 32, }
			]
		}]
	},
});