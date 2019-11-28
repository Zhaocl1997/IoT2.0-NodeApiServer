'use strict'

// 获取客户IP
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
}

// mongoDB时间转换为日期
function timeFormat(time, format) {
    const t = new Date(time) // 2019-11-09T06:27:57.040Z
    const tf = (i) => { return (i < 10 ? '0' : '') + i }

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (key) => {
        switch (key) {
            case 'YYYY':
                return tf(t.getFullYear())
                break
            case 'MM':
                return tf(t.getMonth() + 1)
                break
            case 'DD':
                return tf(t.getDate())
                break
            case 'HH':
                return tf(t.getHours())
                break
            case 'mm':
                return tf(t.getMinutes())
                break
            case 'ss':
                return tf(t.getSeconds())
                break
        }
    })
}

// 获取当前时间
function getNow() {
    let date_ob = new Date()
    let date = ("0" + date_ob.getDate()).slice(-2)
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
    let year = date_ob.getFullYear()
    let hours = date_ob.getHours()
    let minutes = date_ob.getMinutes()
    let seconds = date_ob.getSeconds()
    let mseconds = date_ob.getMilliseconds()
    let result = year + "/" + month + "/" + date + " " + hours + ":" + minutes + ":" + seconds
    return result
}

const fun = {


    // 判断a与b是否相同
    isEqual(a, b) {
        // 基本类型相同返回true
        if (a === b) { return true }

        // 类型为对象并且元素个数相同
        if (isType.isObject(a) && isType.isObject(b) &&
            Object.keys(a).length === Object.keys(b).length) {
            // 遍历所有对象中所有属性,判断元素是否相同
            for (const key in a) {
                if (a.hasOwnProperty(key)) {
                    if (!isEqual(a[key], b[key]))
                        // 如果对象中具有不相同属性,返回false
                        return false
                }
            }
        } else
            // 类型为数组并且数组长度相同
            if (isType.isArray(a) && isType.isArray(a) && a.length === b.length) {
                for (let i = 0, length = a.length; i < length; i++) {
                    if (!isEqual(a[i], b[i]))
                        // 如果数组元素中具有不相同元素,返回false
                        return false
                }
            } else {
                // 其它类型,均返回false
                return false
            }
        // 走到这里,说明数组或者对象中所有元素都相同,返回true
        return true
    },

    // 判断数据类型
    isNull(value) {
        return Object.prototype.toString.call(value) === '[object Null]'
    },

    isUndefined(value) {
        return Object.prototype.toString.call(value) === '[object Undefined]'
    },

    isString(value) {
        return Object.prototype.toString.call(value) === '[object String]'
    },

    isNumber(value) {
        return Object.prototype.toString.call(value) === '[object Number]'
    },

    isBoolean(value) {
        return Object.prototype.toString.call(value) === '[object Boolean]'
    },

    isObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]'
    },

    isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]'
    },

    isDate(value) {
        return Object.prototype.toString.call(value) === '[object Date]'
    },

    isFunction(value) {
        return Object.prototype.toString.call(value) === '[object Function]'
    },

    isRegExp(value) {
        return Object.prototype.toString.call(value) === '[object RegExp]'
    },

    isJSON(value) {
        return Object.prototype.toString.call(value) === '[object JSON]'
    },

    // 判断对象是否有某属性
    obj_hasValue1(obj, key) {
        if (obj[key]) {
            return true
        }
        return false
    },

    obj_hasValue2(obj, key) {
        if (`${key}` in obj) {
            return true
        }
        return false
    },

    obj_hasValue3(obj, key) {
        if (obj.hasOwnProperty(`${key}`)) {
            return true
        } return false
    },

    // 判断数组是否有某元素
    arr_hasValue1(arr, key) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === key) {
                return true
            }
        }
        return false
    },

    arr_hasValue2(arr, key) {
        if (arr.indexOf(key) != -1) {
            return true
        }
        return false
    },

    arr_hasValue4(arr, key) {
        if (arr.includes(key)) {
            return true
        }
        return false
    },

    // 单个数组去重
    arr_uniq1(arr) {
        const temp = []; // 一个新的临时数组
        for (let i = 0; i < arr.length; i++) {
            if (temp.indexOf(arr[i]) == -1) {
                temp.push(arr[i]);
            }
        }
        return temp;
    },

    arr_uniq2(arr) {
        let temp = {}, r = [], len = arr.length, val, type;
        for (let i = 0; i < len; i++) {
            val = arr[i];
            type = typeof val;
            if (!temp[val]) {
                temp[val] = [type];
                r.push(val);
            } else if (temp[val].indexOf(type) < 0) {
                temp[val].push(type);
                r.push(val);
            }
        }
        return r;
    },

    arr_uniq3(arr) {
        arr.sort();
        let temp = [arr[0]];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] !== temp[temp.length - 1]) {
                temp.push(arr[i]);
            }
        }
        return temp;
    },

    arr_uniq4(arr) {
        let temp = [];
        for (let i = 0; i < arr.length; i++) {
            // 如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
            if (arr.indexOf(arr[i]) == i) {
                temp.push(arr[i])
            }
        }
        return temp;
    },

    arr_uniq5(arr) {
        let temp = [];
        let index = [];
        let l = arr.length;
        for (let i = 0; i < l; i++) {
            for (let j = i + 1; j < l; j++) {
                if (arr[i] === arr[j]) {
                    i++;
                    j = i;
                }
            }
            temp.push(arr[i]);
            index.push(i);
        }
        return temp;
    },

    arr_uniq6(arr) {
        return [...new Set(arr)]
    },

    // 返回：随机元素
    arr_sample(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
    },

    // 返回：数组的最后一个元素
    arr_last(arr) {
        return arr.slice(-1)[0]
    },

    // 返回：排除数组中最后一个元素的数组
    arr_lastDel(arr) {
        return arr.slice(0, -1)
    },

    // 返回：深度平铺完后的数组
    arr_deepFlatten(arr) {
        return [].concat(...arr.map(v => Array.isArray(v) ? arr_deepFlatten(v) : v))
    },

    // 返回：拼接的新数组
    arr_concat(arr, ...args) {
        return [].concat(arr, ...args).sort()
    },

    // 返回：从数组中排除给定值后新数组
    arr_without(arr, ...args) {
        return arr.filter(v => args.indexOf(v) === -1)
    },

    // 返回：数组的第N个元素
    arr_getnth(arr, n) {
        return (n > 0 ? arr.slice(n, n + 1) : arr.slice(n))[0]
    },

    // 返回：a与b的交集并排序
    arr_cross(a, b) {
        return a.filter(v => b.includes(v))
    },

    // 返回：a与b的并集并排序
    arr_merge(a, b) {
        return Array.from(new Set([...a, ...b]))
    },

    // 返回：a的差集并排序
    arr_diffA(a, b) {
        return a.filter(x => !(new Set(b).has(x)))
    },

    // 返回：b的差集并排序
    arr_diffB(a, b) {
        return b.filter(x => !(new Set(a).has(x)))
    },

    // 返回：a与b的差集并排序
    arr_diffAandB(a, b) {
        return this.arr_concat(this.arr_diffA(a, b), this.arr_diffB(a, b))
    }
}

module.exports = { getClientIp, timeFormat, getNow }