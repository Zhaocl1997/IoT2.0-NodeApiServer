'use strict'

const Joi = require('@hapi/joi')
const mongoose = require('mongoose')
const { Data } = require('../data/data.model')

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
 * 预保存钩：添加设备时,通过mac去数据库里寻找数据,如果有,将数据的createdBy绑上
 */
deviceScheme.pre('save', async function (next) {
    const device = this
    const data = await Data.find({ macAddress: device.macAddress })
    if (data) {
        data.forEach(item => {
            item.createdBy = device._id
        })
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

/**
 * 验证：Joi验证
 */
function validateDevice(device) {
    const schema = Joi.object({
        id: Joi.string().empty('').trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('设备ID不合法!')),
        name: Joi.string().empty('').trim().lowercase().min(5).max(12).error(new Error('设备名不合法!')),
        macAddress: Joi.string().empty('').trim().pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/).error(new Error('设备mac地址不合法!')),
        type: Joi.string().required().trim().error(new Error('设备类型地址不合法!')),
        status: Joi.boolean().default(true).error(new Error('设备状态不合法!'))
    });
    return schema.validate(device);
}

const Device = mongoose.model('Device', deviceScheme)

module.exports = { Device, validateDevice }