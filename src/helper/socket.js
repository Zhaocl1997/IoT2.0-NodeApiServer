/**
 * socket 注册
 */

'use strict'

let socket = undefined

// 注册
exports.register = (_socket) => {
    socket = _socket
}

// emit 新数据事件
exports.onNewData = (doc) => {
    if (!socket) return;
    socket.emit('data:save:' + doc.macAddress, doc.data)
}

// emit 新设备事件
exports.onNewDevice = (doc) => {
    if (!socket) return;
    socket.emit('new:device', doc)
}