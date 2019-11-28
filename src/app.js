'use strict'

const http = require('http')
const express = require('express')
const socketio = require('socket.io')
require('express-async-errors')

const app = express()
const server = http.createServer(app)
const io = socketio(server);

require('./services/socketio')(io) // socket配置
require('./services/express')(app) // app配置
require('./services/mqtt') // MQTT配置

// 连接mongodb数据库
require('./services/mongo').startupDB()

module.exports = server