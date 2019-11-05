/**
 * Routes 配置
 */

'use strict'

module.exports = function (app) {

    //路由定义
    app.use('/api/v1/user', require('../api/user'))
    app.use('/api/v1/device', require('../api/device'))
    app.use('/api/v1/data', require('../api/data'))
    app.use('/api/v1/menu', require('../api/menu'))
    app.use('/api/v1/role', require('../api/role'))
    app.use('/api/v1/route', require('../api/route'))
}