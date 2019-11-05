/**
 * 模型更改时向客户端广播更新
 */

'use strict'

let socket = undefined

exports.register = (_socket) => {
  socket = _socket
}

exports.onSave = (doc) => {
  if (!socket) return;
  // 发布'data:save:macAddress'事件
  socket.emit('data:save:' + doc.macAddress, doc)
}