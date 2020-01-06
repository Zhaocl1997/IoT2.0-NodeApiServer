/**
 * Express 配置
 */

'use strict'

const express = require('express')
const session = require('express-session')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const rateLimit = require("express-rate-limit")

const createCodeLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes window
    max: 10, // start blocking after 10 requests
    statusCode: 200,
    message: {
        code: "999999",
        message: "请求次数过多，请稍后尝试"
    }
})

// 自定义中间件
const {
    loggerMW,
    get404MW,
    get500MW,
    corsMW,
    sessionMW
} = require('../middleware/app')

// 中间件配置
const {
    staticOptions,
    staticPath,
    // accessLogStream,
    morganOptions
} = require('../helper/config')

module.exports = (app) => {
    // express Built-In 中间件
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static(staticPath, staticOptions))

    // HTTP保护/压缩文件/记录日志中间件
    app.use(helmet())
    app.use(compression())
    // app.use(morgan('short', { stream: dbStream })) // 文件
    app.use(morgan(morganOptions)) // 数据库

    if (process.env.MODE === 'production') {
        app.set('trust proxy', 1)
        // sessionMW.cookie.secure = true
    }

    // 验证码接口限流
    app.use('/api/v1/user/sendCode', createCodeLimiter)

    // log中间件 
    app.use(loggerMW)

    // 跨域请求中间件
    app.use(corsMW)

    // 会话session中间件
    app.use(session(sessionMW))

    // 路由配置
    require('./routes')(app)

    // 错误捕获中间件(放在最后)
    app.use(get500MW)
    app.use(get404MW)
}