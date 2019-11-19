/**
 * App Middleware 配置
 */

'use strict'

const chalk = require('chalk')
const session = require('express-session')
const { getnow } = require('../helper/public')


function loggerMW(req, res, next) {
    //if (req.method === 'POST') {
        console.log(
            chalk.redBright(`[请求时间]: ${getnow()}`),
            chalk.greenBright(`[请求地址]: ${req.originalUrl}`),
            chalk.cyanBright(`[请求内容]: ${JSON.stringify(req.body)}`)
        )
    //}
    next()
}

function get404MW(req, res, next) {
    res.json({
        code: "999999",
        message: "Page Not Found"
    })
}

function get500MW(error, req, res, next) {
    res.json({
        code: "999999",
        message: error.message
    })
}

function corsMW(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL)
    res.setHeader('Access-Control-Allow-Method', 'POST, OPTION')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
}

function sessionMW() {
    return session({
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_SERECT,
        resave: false,   // 强制将会话保存回会话存储，即使在请求期间从未修改过会话也是如此
        saveUninitialized: false, // 强制将“未初始化”的会话保存到存储中
        //当会话是新会话但未修改时该会话并未初始化
        // cookie: {
        //     domain: "",
        //     path: "/",
        //     maxAge: 1000 * 60 * 60 * 24 * 7,
        //     // secure: true    // 必须是https才可以启用
        // }
    })
}

module.exports = {
    loggerMW,
    get404MW,
    get500MW,
    corsMW,
    sessionMW
}