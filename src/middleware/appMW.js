/**
 * App Middleware 配置
 */

'use strict'

const chalk = require('chalk')
const { getnow } = require('../helper/public')

const appMW = {
    // console中间件
    logger(req, res, next) {
        console.log(
            chalk.redBright(`[请求时间]: ${getnow()}`),
            chalk.greenBright(`[请求地址]: ${req.originalUrl}`),
            chalk.cyanBright(`[请求内容]: ${JSON.stringify(req.body)}`),
        )
        next()
    },
    // 404捕获
    get404(req, res, next) {
        res.json({
            code: "999999",
            message: "Page Not Found"
        })
    },
    // 500捕获
    get500(error, req, res, next) {
        res.json({
            code: "999999",
            message: error.message
        })
    }
}

module.exports = appMW