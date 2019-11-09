'use strict'

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Device = require('../device/device.model')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

/**
 * 虚拟属性,对应设备
 */
userSchema.virtual('devices', {
    ref: 'Device',
    localField: '_id',
    foreignField: 'createdBy'
})

/**
 * 实例方法：userToJSON时去掉敏感信息
 */
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    // delete userObject.password

    return userObject
}

/**
 * 实例方法：生成令牌
 */
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign(
        {
            _id: user._id.toString(),
            role: user.role
        },
        process.env.JWT_SERECT,
        { expiresIn: process.env.JWT_EXPIRE })

    return token
}

/**
 * 静态方法：通过凭据(email/phone)查找用户并验证密码,登录使用
 */
userSchema.statics.findByCredentials = async (body) => {
    const user = await User.findOne({ $or: [{ email: body.email }, { phone: body.phone }] })
    const isMatch = await bcrypt.compare(body.password, user.password)
    if (!isMatch) { throw new Error('密码错误') }
    return user
}

/**
 * 静态方法：通过凭据(email/phone)查找用户是否存在,解决email/phone唯一性问题,注册或新建和修改时使用
 */
userSchema.statics.isExist = async (body) => {
    const user = await User.findOne({ $and: [{ _id: { $ne: body.id }, $or: [{ phone: body.phone }, { email: body.email }] }] })
    if (user) { throw new Error('用户已存在') }
    return user
}

/**
 * 预保存钩：密码存到数据库之前加密
 */
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 12)
    }
    next()
})

/**
 * 预保存钩：删除用户时,同时删除用户的设备
 */
userSchema.pre('remove', async function (next) {
    const user = this
    await Device.deleteMany({ createdBy: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User