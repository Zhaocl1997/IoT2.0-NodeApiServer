'use strict'

const mongoose = require('mongoose')
const User = require('../user/user.model')
const Device = require('../device/device.model')

const dataSchema = new mongoose.Schema({
    macAddress: {
        type: String,
        required: true
    },
    data: {
        type: mongoose.Mixed,
        required: true
    },
    isDrop: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Device'
    }
}, {
    timestamps: true,
    versionKey: false
})

/**
 *  pre中间件：数据保存前,绑定设备ID和用户ID
 */
dataSchema.pre('save', async function (next) {
    const data = this
    const device = await Device.findOne({ macAddress: data.macAddress })
    data.createdBy = device._id
    next()
})


/**
 *  post中间件：数据保存后,socket发布一个事件
 */
dataSchema.post('save', (doc) => {
    require('./data.socket').onSave(doc)
})

const Data = mongoose.model('Data', dataSchema)

module.exports = Data