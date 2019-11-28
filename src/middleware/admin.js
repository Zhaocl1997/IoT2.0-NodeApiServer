'use strict'

const base = require('./base')
const authorizationMiddleWare = require('./auth/authorization')

// 管理员中间件
const admin = [base, authorizationMiddleWare]

module.exports = admin