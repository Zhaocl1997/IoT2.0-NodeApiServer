/**
 * App Middleware 配置
 */

'use strict'

const chalk = require('chalk')
const session = require('express-session')
const { getNow } = require('../helper/public')

const loggerMW = (req, res, next) => {    
    if (req.method === 'POST') {
        console.log(
            chalk.redBright(`[请求时间]: ${getNow()}`),
            chalk.greenBright(`[请求地址]: ${req.originalUrl}`),
            chalk.cyanBright(`[请求内容]: ${JSON.stringify(req.body)}`)
        )
    }
    next()
}

const get404MW = (req, res, next) => {
    res.status(404).json({ code: "999999", message: "Page Not Found" })
}

const get500MW = (err, req, res, next) => {
      
    // Mongoose bad ObjectId error
    if (err.name === 'CastError') {
        const message = `ID为${err.value}的数据不存在`
        err.message = message
    }

    // Mongoose duplicate key error
    if (err.name === 'MongoError' && err.code === 11000) {
        const message = `${Object.keys(err.keyValue)}已存在`
        err.message = message
    }

    // Mongoose validation error
    // if (err.name === 'ValidationError') {
    //     const message = `字段${err.details[0].message.split('"')[1]}不合法`
    //     err.message = message
    // }

    res.json({ code: "999999", message: err.message })
}

const corsMW = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL)
    res.setHeader('Access-Control-Allow-Method', 'POST, OPTION')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, clientip')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
}

const sessionMW = () => {
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