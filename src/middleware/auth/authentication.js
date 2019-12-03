'use strict'

const jwt = require('jsonwebtoken')
const User = require('../../api/user/user.model')

// 验证用户是否认证
async function authenticationMiddleWare(req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SERECT)
        const user = await User.findOne({ _id: decoded._id }, '-createdAt -updatedAt')
        if (!user) throw new Error('您的帐号不存在哦~')

        req.user = user
        next()
    } catch (e) {
        throw new Error('您在进行未认证访问哦')
    }
}

module.exports = authenticationMiddleWare