'use strict'

const mongoose = require('mongoose')
const Data = require('../data/data.model')

const deviceScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    macAddress: {
        type: String,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
})

/**
 * 虚拟属性,对应数据
 */
deviceScheme.virtual('datas', {
    ref: 'Data',
    localField: '_id',
    foreignField: 'createdBy'
})

/**
 * 静态方法：通过凭据(macAddress)查找设备是否存在,解决macAddress唯一性问题,新建或修改时使用
 */
deviceScheme.statics.isExist = async (macAddress) => {
    const device = await Device.findOne({ macAddress })
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
            require('../../services/mqtt').onDHT11(device.status)
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
 * 预保存钩：删除设备时,同时删除设备的数据
 */
deviceScheme.pre('remove', async function (next) {
    const device = this
    await Data.deleteMany({ macAddress: device.macAddress })
    next()
})

const Device = mongoose.model('Device', deviceScheme)

module.exports = Device