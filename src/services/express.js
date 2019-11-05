/**
 * Express 配置
 */

'use strict'

const express = require('express')
const session = require('express-session')

const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

// 自定义中间件
const appMW = require('../middleware/appMW')

// 中间件配置
const {
    staticOptions,
    staticPath,
    accessLogStream
} = require('../helper/config')

module.exports = function (app) {
    // express Built-In 中间件
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static(staticPath, staticOptions))

    // HTTP保护/压缩文件/记录日志中间件
    app.use(helmet())
    app.use(compression())
    app.use(morgan('combined', { stream: accessLogStream }))

    // log中间件 
    app.use(appMW.logger)

    // 跨域请求中间件
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL)
        res.setHeader('Access-Control-Allow-Method', 'POST, OPTION')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        res.setHeader('Access-Control-Allow-Credentials', true)
        next()
    })

    // 会话session中间件
    app.use(session({
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_SERECT,
        resave: false,   // 强制将会话保存回会话存储，即使在请求期间从未修改过会话也是如此
        saveUninitialized: false, // 强制将“未初始化”的会话保存到存储中
        // 当会话是新会话但未修改时该会话并未初始化
        cookie: {
            domain: "",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 7,
            // secure: true    // 必须是https才可以启用
        }
    }))

    // 路由配置
    require('./routes')(app)

    // 错误捕获中间件(放在最后)
    app.use(appMW.get500)
    app.use(appMW.get404)
}