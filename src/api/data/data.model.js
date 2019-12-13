'use strict'

const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    macAddress: {
        type: String,
        required: true // 必须
    },
    data: {
        type: mongoose.Mixed,
        required: true // 必须
    },
    flag: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // 必须
        ref: 'Device'
    }
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