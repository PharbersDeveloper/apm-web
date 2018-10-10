/**
 * @param {*} 数组 
 * @param {*} 属性
 * return 一个新的Object 
 */
export function groupBy(objectArray, property) {
    return objectArray.reduce(function(acc, obj) {
        var key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

