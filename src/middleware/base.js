'use strict'

const statusMW = require('./validate/status')
const authenticationMW = require('./auth/authentication')

// 基础中间件
const base = [authenticationMW, statusMW]

module.exports = base