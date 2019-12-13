/**
 * Routes 配置
 */

'use strict'

module.exports = (app) => {
    //路由定义
    app.use('/api/v1/user', require('../api/user'))
    app.use('/api/v1/device', require('../api/device'))
    app.use('/api/v1/data', require('../api/data'))
    app.use('/api/v1/menu', require('../api/menu'))
    app.use('/api/v1/role', require('../api/role'))
    app.use('/api/v1/route', require('../api/route'))
    app.use('/api/v1/article', require('../api/article'))
    app.use('/api/v1/category', require('../api/category'))
    app.use('/api/v1/db', require('../api/db'))
    app.use('/api/v1/logger', require('../api/logger'))
}