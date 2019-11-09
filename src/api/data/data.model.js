'use strict'

const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    macAddress: String,
    data: mongoose.Mixed,
    createdBy: mongoose.Schema.Types.ObjectId,
}, {
    timestamps: true,
    versionKey: false
})

/**
 *  post中间件：数据保存后,socket发布一个事件
 */
dataSchema.post('save', (doc) => {
    require('./data.socket').onSave(doc)
})

const Data = mongoose.model('Data', dataSchema)

module.exports = Data