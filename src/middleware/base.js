'use strict'

const statusMiddleWare = require('./validate/status')
const authenticationMiddleWare = require('./auth/authentication')

// 基础中间件
const base = [authenticationMiddleWare, statusMiddleWare]

module.exports = base