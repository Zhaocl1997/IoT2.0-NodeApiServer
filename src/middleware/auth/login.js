'use strict'

const User = require('../../api/user/user.model')
const { validateUserMiddleWare } = require('../validate/validate')
const statusMiddleWare = require('../validate/status')

// 验证验证码
async function verifyCodeMiddleWare(req, res, next) {
    // 验证验证码
    if (req.body.verifyCode && req.session.randomcode !== req.body.verifyCode) throw new Error('您的验证码输入错误~')
    next()
}

// 通过email/phone查找用户验证密码
async function findByCredentialsAndCheckPassMiddleWare(req, res, next) {
    const user = await User.findByCredentialsAndCheckPass(req.body)
    req.user = user
    next()
}

const loginMiddleWare = [
    verifyCodeMiddleWare,
    validateUserMiddleWare,
    findByCredentialsAndCheckPassMiddleWare,
    statusMiddleWare
]

module.exports = loginMiddleWare