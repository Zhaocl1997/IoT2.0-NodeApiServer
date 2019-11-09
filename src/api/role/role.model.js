'use strict'

const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    describe: {
        type: String,
        require: true
    },
    number: {
        type: Number,
        default: 0
    },
    menu: {
        type: [mongoose.Schema.Types.ObjectId],
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
roleSchema.virtual('users', {
    ref: 'User',
    localField: 'name',
    foreignField: 'role'
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