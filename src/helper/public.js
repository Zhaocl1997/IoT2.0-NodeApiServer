'use strict'

// 时间格式转换
const timeFormat = (time, format) => {
    const t = new Date(time) // 2019-11-09T06:27:57.040Z
    const tf = (i) => { return (i < 10 ? '0' : '') + i }

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (key) => {
        switch (key) {
            case 'YYYY':
                return tf(t.getFullYear())
            case 'MM':
                return tf(t.getMonth() + 1)
            case 'DD':
                return tf(t.getDate())
            case 'HH':
                return tf(t.getHours())
            case 'mm':
                return tf(t.getMinutes())
            case 'ss':
                return tf(t.getSeconds())
        }
    })
}

// 获取当前时间
const getNow = () => {
    return timeFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
}

// index 参数封装
const index_params = (body) => {
    // 分页
    const skip = parseInt((body.pagenum - 1) * body.pagerow)
    const limit = parseInt(body.pagerow)
    const reg = new RegExp(body.filters, 'i')

    let sort
    switch (body.sortField) {
        // base
        case "updatedAt":
            sort = { updatedAt: body.sortOrder }
            break
        case "createdAt":
            sort = { createdAt: body.sortOrder }
            break
        case "status":
            sort = { status: body.sortOrder }
            break

        // route
        case "meta.needLogin":
            sort = { "meta.needLogin": body.sortOrder }
            break

        // device
        case "type":
            sort = { type: body.sortOrder }
            break
        case "createdBy.name":
            sort = { 'createdBy.name': body.sortOrder }
            break

        // logger
        case "method":
            sort = { method: body.sortOrder }
            break
        case "statusCode":
            sort = { statusCode: body.sortOrder }
            break
        case "requestTime":
            sort = { requestTime: body.sortOrder }
            break
        case "responseTime":
            sort = { responseTime: body.sortOrder }
            break
        default:
            break
    }

    return { skip, limit, sort, reg }
}

// 分类递归
const toTreeData = (data, pid) => {
    function tree(id) {
        let arr = []
        data.filter(item => {
            return item.parentID.toString() === id;
        }).forEach(item => {
            arr.push({
                _id: item._id,
                name: item.name,
                key: item.key,
                desc: item.desc,
                subs: tree(item._id.toString()),
                articles: item.articles,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            })
        })
        return arr
    }
    return tree(pid)  // 第一级节点的父id，是null或者0，视情况传入
}

const toTreeSub = (data) => {
    for (var i = 0; i < data.length; i++) {
        if (data[i].subs.length < 1) {
            // children若为空数组，则将children设为undefined
            data[i].subs = undefined;
        } else {
            // children若不为空数组，则继续 递归调用 本方法
            toTreeSub(data[i].subs);
        }
    }
    return data;
}

module.exports = { timeFormat, getNow, index_params, toTreeData, toTreeSub }