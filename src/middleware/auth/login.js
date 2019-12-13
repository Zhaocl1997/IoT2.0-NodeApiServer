'use strict'

const User = require('../../api/user/user.model')
const Role = require('../../api/role/role.model')

exports.loginMW = async (req, res, next) => {
    // 验证码
    if (req.body.verifyCode && req.session.randomcode !== req.body.verifyCode) {
        throw new Error('验证码输入错误')
    }

    // 通过凭据(email/phone)查找用户并验证密码
    const user = await User.findAndCheck(req.body.email, req.body.phone, req.body.password)

    // 验证角色状态
    const role = await Role.findById(user.role)
    if (!role.status) throw new Error('您的角色暂时无法登录~，请联系管理员')

    // 验证用户状态
    if (!user.status) throw new Error('您的帐号暂时无法登录~，请联系管理员')

    req.user = user

    next()
}