'use strict'

const Joi = require('@hapi/joi')
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

/**
 * 验证：Joi验证
 */
function validateData(data) {
    const schema = Joi.object({
        macAddress: Joi.string().empty('').trim().pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/).error(new Error('设备mac地址不合法!')),
    });
    return schema.validate(data);
}

const Data = mongoose.model('Data', dataSchema)

module.exports = { Data, validateData }