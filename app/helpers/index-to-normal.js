import { helper } from '@ember/component/helper';

export function indexToNormal(params /*, hash*/ ) {
	if (typeof Number(params) === 'number') {
		return Number(params) + 1;
	} else {
		return 'NaN'
	}
	// return Number(params) + 1;
}

export default helper(indexToNormal);