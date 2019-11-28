'use strict'

// 验证用户是否授权    
function authorizationMiddleWare(req, res, next) {
    if (req.user.role !== 'admin') throw new Error('您在进行未授权访问哦~')
    next()
}

module.exports = authorizationMiddleWare