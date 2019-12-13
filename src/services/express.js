/**
 * Express 配置
 */

'use strict'

const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

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

    // log中间件 
    app.use(loggerMW)

    // 跨域请求中间件
    app.use(corsMW)

    // 会话session中间件
    app.use(sessionMW())

    // 路由配置
    require('./routes')(app)

    // 错误捕获中间件(放在最后)
    app.use(get500MW)
    app.use(get404MW)
}