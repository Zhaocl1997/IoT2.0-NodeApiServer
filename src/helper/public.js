'use strict'

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

function aggregate_merge(arr) {
    let map = {};
    let dest = [];

    for (let i = 0; i < arr.length; i++) {
        let ai = arr[i];
        if (!map[ai._id]) {
            dest.push({
                _id: ai._id,
                icon: ai.icon,
                title: ai.title,
                index: ai.index,
                subs: [ai.subs]
            });
            map[ai._id] = ai._id;
        } else {
            for (let j = 0; j < dest.length; j++) {
                let dj = dest[j];
                if (dj._id.toString() === ai._id.toString()) {
                    dj.subs.push(ai.subs);
                    break;
                }
            }
        }
    }
    return dest.sort()
}

module.exports = { timeFormat, getNow, aggregate_merge }