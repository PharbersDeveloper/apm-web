/**
 * @param {*} objectArray 数组
 * @param {*} property 属性
 * @return 一个新的Object
 */
export function groupBy(objectArray, property) {
	return objectArray.reduce(function (acc, obj) {
		// window.console.info(obj)
		// window.console.info(typeof [])
		var key = null;
		try {
			key = obj.get(property)
		} catch (e) {
			key = obj[property]
		}
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(obj);
		return acc;
	}, {});
}

/**
 *
 * @param {*} timestamp 时间戳
 * @param {*} format 格式化字符串
 * @return 格式化后的日期字符串
 */
export function dateFormat(timestamp, format) {
	let data = new Date(timestamp);
	var o = {
		"M+": data.getMonth() + 1, //月份
		"d+": data.getDate(), //日
		"h+": data.getHours(), //小时
		"m+": data.getMinutes(), //分
		"s+": data.getSeconds(), //秒
		"q+": Math.floor((data.getMonth() + 3) / 3), //季度
		"S": data.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return format;
}

/**
 *
 * @param {*} number 数字
 * @return 千分位的字符串
 */
export function numberThousands(number) {
	let p = params.toString().replace(/[,，、]/g, "");
	if (isNaN(p)) {
		return p;
	} else {
		let zznf = /([-+]?)(\d*)(\.\d+)?/g
		let groups = zznf.exec("" + p),
			mask = groups[1], //符号位
			integers = (groups[2] || "").split(""), //整数部分
			decimal = groups[3] || "", //小数部分
			remain = integers.length % 3;

		let temp = integers.reduce(function (previousValue, currentValue, index) {
			if (index + 1 === remain || (index + 1 - remain) % 3 === 0) {
				return previousValue + currentValue + ",";
			} else {
				return previousValue + currentValue;
			}
		}, "").replace(/,$/g, "");
		return mask + temp;
	}
}

/**
 * 验证用户输入
 * @param {*} value typeof string
 * @return Boolean 
 */
export function verificationInput(value, range = false) {
	let isOk = false,
		reg = null;
	if (range) {
		reg = /^100$|^[\d]{1,2}(\.[\d])?$/;
		isOk = reg.test(value);
		return !isOk && value !== '';
	} else {
		reg = /^[\d]{1,10}(\.[\d])?$/;
		if (value === '') {
			return false
		} else {
			isOk = reg.test(value);
			return !isOk;
		}

	}
}


