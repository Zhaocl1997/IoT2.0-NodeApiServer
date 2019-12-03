'use strict'

const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    describe: {
        type: String,
        require: true
    },
    menu: {
        type: Array,
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
 * 虚拟属性,对应用户和菜单
 */
roleSchema.virtual('userCount', {
    ref: 'User',
    localField: '_id',
    foreignField: 'role',
    count: true
})

/**
 * 预保存钩：删除角色时,同时删除该角色的所有用户
 */
roleSchema.pre('remove', async function (next) {
    const role = this
    // await User.deleteMany({ role: role.name })
    next()
})

const Role = mongoose.model('Role', roleSchema)

module.exports = Role