'use strict'

const base = require('./base')
const authorizationMW = require('./auth/authorization')

// 管理员中间件
const admin = [base, authorizationMW]

module.exports = admin