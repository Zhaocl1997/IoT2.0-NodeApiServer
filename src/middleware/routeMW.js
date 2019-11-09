/**
 * Routes Middleware 配置
 */

'use strict'

const jwt = require('jsonwebtoken')
const User = require('../api/user/user.model')
const Role = require('../api/role/role.model')

// 验证用户是否认证
async function autMW(req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SERECT)
        const user = await User.findOne({ _id: decoded._id })
        if (!user) { throw new Error('用户不存在') }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        throw new Error('未认证访问')
    }
}

// 验证用户是否授权    
function authMW(req, res, next) {
    if (req.user.role !== 'admin') { throw new Error('未授权访问') }
    next()
}

// 验证角色状态是否为true
async function rSMW(req, res, next) {
    const user = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
    if (!user) { throw new Error('用户不存在') }
    const role = await Role.findOne({ name: user.role })
    if (role.status === false) { throw new Error('该角色暂时无法登录') }

    req.user = user
    next()
}

// 验证用户状态是否为true
async function uSMW(req, res, next) {
    if (req.user.status === false) { throw new Error('该账号暂时无法登录') }
    next()
}

module.exports = {
    autMW,
    authMW,
    uSMW,
    rSMW
}