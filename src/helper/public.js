'use strict'

const Joi = require('@hapi/joi')

// 获取当前时间
function getnow() {
    let date_ob = new Date()
    let date = ("0" + date_ob.getDate()).slice(-2)
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
    let year = date_ob.getFullYear()
    let hours = date_ob.getHours()
    let minutes = date_ob.getMinutes()
    let seconds = date_ob.getSeconds()
    let mseconds = date_ob.getMilliseconds()
    let result = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    return result
}

// 获取客户IP
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
}

// 验证mongoID
function validateId(id) {
    const schema = Joi.string().required().trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('ID不合法'))
    return schema.validate(id);
}

module.exports = {
    getnow,
    getClientIp,
    validateId
}