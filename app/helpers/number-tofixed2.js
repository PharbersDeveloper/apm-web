import { helper } from '@ember/component/helper';

export function numberTofixed2(params /*, hash*/ ) {
	let p = params.toString().replace(/[,，、]/g, "");
	if (isNaN(p)) {
		return p;
	} else {
		return Number(p).toFixed(2);
	}
}

export default helper(numberTofixed2);