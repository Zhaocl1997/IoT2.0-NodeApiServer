'use strict'

const Role = require('../../api/role/role.model')

// 验证用户是否授权    
async function authorizationMW(req, res, next) {
    const role = await Role.findById(req.user.role)
    if (role.name !== 'admin') throw new Error('您在进行未授权访问哦')
    next()
}

module.exports = authorizationMW