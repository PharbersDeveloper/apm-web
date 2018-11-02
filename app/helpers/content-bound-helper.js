import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';

/**
 * 现在只有br，后续在此还可增加
 * @param {*} text
 */
export function contentBoundHelper(text /*, hash*/ ) {
	return htmlSafe(text[0].replace(/\n/g, '<br>'));
}

export default helper(contentBoundHelper);