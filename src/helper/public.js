'use strict'

// mongoDB时间转换为日期
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

module.exports = { timeFormat, getNow, index_params }