import Controller from '@ember/controller';

export default Controller.extend({
	init() {
		this._super(...arguments);
		this.chooseData = [{
			name: "产品A",
			values: [{
					ym: "201801",
					value: 50,
					unit: ''
				},
				{
					ym: "201802",
					value: 190,
					unit: ''
				},
				{
					ym: "201803",
					value: 180,
					unit: ''
				},
				{
					ym: "201804",
					value: 190,
					unit: ''
				},
				{
					ym: "201805",
					value: 160,
					unit: ''
				},
				{
					ym: "201806",
					value: 160,
					unit: ''
				},
				{
					ym: "201807",
					value: 120,
					unit: ''
				},
				{
					ym: "201808",
					value: 180,
					unit: ''
				},
				{
					ym: "201809",
					value: 110,
					unit: ''
				},
				{
					ym: "201810",
					value: 140,
					unit: ''
				},
				{
					ym: "201811",
					value: 55,
					unit: ''
				},
				{
					ym: "201812",
					value: 120,
					unit: ''
				}
			]
		}, {
			name: "竞品A",
			values: [{
					ym: "201801",
					value: 150,
					unit: ''
				},
				{
					ym: "201802",
					value: 160,
					unit: ''
				},
				{
					ym: "201803",
					value: 120,
					unit: ''
				},
				{
					ym: "201804",
					value: 140,
					unit: ''
				},
				{
					ym: "201805",
					value: 160,
					unit: ''
				},
				{
					ym: "201806",
					value: 30,
					unit: ''
				},
				{
					ym: "201807",
					value: 170,
					unit: ''
				},
				{
					ym: "201808",
					value: 130,
					unit: ''
				},
				{
					ym: "201809",
					value: 160,
					unit: ''
				},
				{
					ym: "201810",
					value: 130,
					unit: ''
				},
				{
					ym: "201811",
					value: 75,
					unit: ''
				},
				{
					ym: "201812",
					value: 130,
					unit: ''
				}
			]
		}, {
			name: "竞品B",
			values: [{
					ym: "201801",
					value: 250,
					unit: ''
				},
				{
					ym: "201802",
					value: 260,
					unit: ''
				},
				{
					ym: "201803",
					value: 220,
					unit: ''
				},
				{
					ym: "201804",
					value: 240,
					unit: ''
				},
				{
					ym: "201805",
					value: 260,
					unit: ''
				},
				{
					ym: "201806",
					value: 230,
					unit: ''
				},
				{
					ym: "201807",
					value: 270,
					unit: ''
				},
				{
					ym: "201808",
					value: 230,
					unit: ''
				},
				{
					ym: "201809",
					value: 260,
					unit: ''
				},
				{
					ym: "201810",
					value: 230,
					unit: ''
				},
				{
					ym: "201811",
					value: 175,
					unit: ''
				},
				{
					ym: "201812",
					value: 230,
					unit: ''
				}
			]
		}];
		this.sectionData = [{
			name: "区域A",
			values: [{
					ym: "201801",
					value: 50,
					unit: ''
				},
				{
					ym: "201802",
					value: 10,
					unit: ''
				},
				{
					ym: "201803",
					value: 12,
					unit: ''
				},
				{
					ym: "201804",
					value: 11,
					unit: ''
				},
				{
					ym: "201805",
					value: 16,
					unit: ''
				},
				{
					ym: "201806",
					value: 19,
					unit: ''
				},
				{
					ym: "201807",
					value: 20,
					unit: ''
				},
				{
					ym: "201808",
					value: 40,
					unit: ''
				},
				{
					ym: "201809",
					value: 36,
					unit: ''
				},
				{
					ym: "201810",
					value: 45,
					unit: ''
				},
				{
					ym: "201811",
					value: 55,
					unit: ''
				},
				{
					ym: "201812",
					value: 31,
					unit: ''
				}
			]
		}, {
			name: "区域B",
			values: [{
					ym: "201801",
					value: 50,
					unit: ''
				},
				{
					ym: "201802",
					value: 56,
					unit: ''
				},
				{
					ym: "201803",
					value: 26,
					unit: ''
				},
				{
					ym: "201804",
					value: 19,
					unit: ''
				},
				{
					ym: "201805",
					value: 36,
					unit: ''
				},
				{
					ym: "201806",
					value: 30,
					unit: ''
				},
				{
					ym: "201807",
					value: 27,
					unit: ''
				},
				{
					ym: "201808",
					value: 26,
					unit: ''
				},
				{
					ym: "201809",
					value: 19,
					unit: ''
				},
				{
					ym: "201810",
					value: 23,
					unit: ''
				},
				{
					ym: "201811",
					value: 16,
					unit: ''
				},
				{
					ym: "201812",
					value: 23,
					unit: ''
				}
			]
		}, {
			name: "区域C",
			values: [{
					ym: "201801",
					value: 18,
					unit: ''
				},
				{
					ym: "201802",
					value: 26,
					unit: ''
				},
				{
					ym: "201803",
					value: 37,
					unit: ''
				},
				{
					ym: "201804",
					value: 50,
					unit: ''
				},
				{
					ym: "201805",
					value: 36,
					unit: ''
				},
				{
					ym: "201806",
					value: 51,
					unit: ''
				},
				{
					ym: "201807",
					value: 42,
					unit: ''
				},
				{
					ym: "201808",
					value: 16,
					unit: ''
				},
				{
					ym: "201809",
					value: 52,
					unit: ''
				},
				{
					ym: "201810",
					value: 36,
					unit: ''
				},
				{
					ym: "201811",
					value: 41,
					unit: ''
				},
				{
					ym: "201812",
					value: 25,
					unit: ''
				}
			]
		}, {
			name: "区域D",
			values: [{
					ym: "201801",
					value: 35,
					unit: ''
				},
				{
					ym: "201802",
					value: 56,
					unit: ''
				},
				{
					ym: "201803",
					value: 45,
					unit: ''
				},
				{
					ym: "201804",
					value: 36,
					unit: ''
				},
				{
					ym: "201805",
					value: 15,
					unit: ''
				},
				{
					ym: "201806",
					value: 28,
					unit: ''
				},
				{
					ym: "201807",
					value: 35,
					unit: ''
				},
				{
					ym: "201808",
					value: 56,
					unit: ''
				},
				{
					ym: "201809",
					value: 27,
					unit: ''
				},
				{
					ym: "201810",
					value: 42,
					unit: ''
				},
				{
					ym: "201811",
					value: 25,
					unit: ''
				},
				{
					ym: "201812",
					value: 10,
					unit: ''
				}
			]
		}, {
			name: "区域E",
			values: [{
					ym: "201801",
					value: 46,
					unit: ''
				},
				{
					ym: "201802",
					value: 44,
					unit: ''
				},
				{
					ym: "201803",
					value: 47,
					unit: ''
				},
				{
					ym: "201804",
					value: 62,
					unit: ''
				},
				{
					ym: "201805",
					value: 18,
					unit: ''
				},
				{
					ym: "201806",
					value: 35,
					unit: ''
				},
				{
					ym: "201807",
					value: 45,
					unit: ''
				},
				{
					ym: "201808",
					value: 19,
					unit: ''
				},
				{
					ym: "201809",
					value: 20,
					unit: ''
				},
				{
					ym: "201810",
					value: 44,
					unit: ''
				},
				{
					ym: "201811",
					value: 56,
					unit: ''
				},
				{
					ym: "201812",
					value: 42,
					unit: ''
				}
			]
		}, {
			name: "区域E",
			values: [{
					ym: "201801",
					value: 52,
					unit: ''
				},
				{
					ym: "201802",
					value: 34,
					unit: ''
				},
				{
					ym: "201803",
					value: 41,
					unit: ''
				},
				{
					ym: "201804",
					value: 42,
					unit: ''
				},
				{
					ym: "201805",
					value: 48,
					unit: ''
				},
				{
					ym: "201806",
					value: 15,
					unit: ''
				},
				{
					ym: "201807",
					value: 35,
					unit: ''
				},
				{
					ym: "201808",
					value: 29,
					unit: ''
				},
				{
					ym: "201809",
					value: 40,
					unit: ''
				},
				{
					ym: "201810",
					value: 34,
					unit: ''
				},
				{
					ym: "201811",
					value: 26,
					unit: ''
				},
				{
					ym: "201812",
					value: 32,
					unit: ''
				}
			]
		}]
	},
});