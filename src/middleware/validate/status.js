'use strict'

const Role = require('../../api/role/role.model')

// 验证角色状态是否为true
async function roleStatusMiddelWare(req, res, next) {    
    const role = await Role.findById(req.user.role)
    if (!role.status) throw new Error('您的角色暂时无法登录~，请联系管理员')
    next()
}

// 验证用户状态是否为true
async function userStatusMiddleWare(req, res, next) {
    if (!req.user.status) throw new Error('您的帐号暂时无法登录~，请联系管理员')
    next()
}

const statusMW = [
    roleStatusMiddelWare,
    userStatusMiddleWare
]

module.exports = statusMW