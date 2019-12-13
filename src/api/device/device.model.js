'use strict'

const mongoose = require('mongoose')
const Data = require('../data/data.model')

const deviceScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true, // 必须
        unique: true // 唯一
    },
    macAddress: {
        type: String,
        required: true, // 必须
        unique: true  // 唯一
    },
    type: {
        type: String,
        required: true  // 必须
    },
    status: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true,
    versionKey: false
})

/**
 * 虚拟属性,对应数据
 */
deviceScheme.virtual('dataCount', {
    ref: 'Data',
    localField: '_id',
    foreignField: 'createdBy',
    count: true
})

/**
 * 静态方法：通过凭据(mac/name)查找设备是否存在,解决mac/name唯一性问题
 * 新建或修改时使用
 */
deviceScheme.statics.isExist = async (body) => {
    const device = await Device.findOne({ $and: [{ _id: { $ne: body._id }, $or: [{ macAddress: body.macAddress }, { name: body.name }] }] })
    if (device) { throw new Error('设备已存在') }

    return device
}

/**
 * 预保存钩：根据状态决定设备开关
 */
deviceScheme.pre('save', async function (next) {
    const device = this
    switch (device.type) {
        case 'sensor':
            require('../../services/mqtt').onDHT11({ status: device.status, macAddress: device.macAddress })
            break;

        case 'camera':
            require('../../services/mqtt').onCamera({ status: device.status, macAddress: device.macAddress })
            break;

        default:
            break;
    }
    next()
})

/**
 * 预保存钩：删除设备时,同时逻辑删除设备的数据
 */
deviceScheme.pre('remove', async function (next) {
    const device = this
    const data = await Data.find({ macAddress: device.macAddress })
    for (let i = 0; i < data.length; i++) {
        const oneData = data[i];
        oneData.flag = true
        await oneData.save()
    }
    next()
})

const Device = mongoose.model('Device', deviceScheme)

module.exports = Device