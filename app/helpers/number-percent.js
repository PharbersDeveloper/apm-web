import { helper } from '@ember/component/helper';

export function numberPercent(params /*, hash*/ ) {
	if (isNaN(params)) {
		return params;
	} else {
		let percent = parseFloat(params) * 100;
		if (percent == 0) {
			return '0%';
		} else {
			return (percent.toFixed(1)).toString() + '%';

		}
	}
}

export default helper(numberPercent);