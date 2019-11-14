/**
 * Socket.io 配置
 */

'use strict'

const chalk = require('chalk')
const socketioJwt = require('socketio-jwt')

// 当用户连接时，执行此函数
function onConnect(socket) {
    require('../api/data/data.socket').register(socket)
}

// 暴露
module.exports = (io) => {
    // 认证
    io.use(socketioJwt.authorize({
        secret: process.env.JWT_SERECT,
        handshake: true
    }))

    // 建立链接
    io.on('connection', (socket) => {
        // console新的socket连接
        console.log(chalk.black.bgWhite('New WebSocket connection'))

        // 读取socket配置
        const socketID = socket.id
        const socketAddress = socket.handshake.headers.origin
        const clientIP = socket.request.connection.remoteAddress;

        // 连接socket
        onConnect(socket)
        console.log(chalk.black.bgCyan('%s connected on %s'), socketID, clientIP)

        // 监听断开socket事件
        socket.on('disconnect', () => {
            console.log(chalk.black.bgRed('%s Disconnected'), socketAddress);
        })
    })
}