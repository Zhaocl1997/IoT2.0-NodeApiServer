'use strict'

const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true, // 唯一
        required: true,
        trim: true,
        lowercase: true,
        min: 3,
        max: 16
    },
    describe: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        min: 3,
        max: 16
    },
    menu: {
        type: Array,
        required: true
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
 * 静态方法：通过凭据(name)查找角色是否存在,解决name唯一性问题
 * 新建和修改时使用
 */
roleSchema.statics.isExist = async (body) => {
    const role = await Role.findOne({ $and: [{ _id: { $ne: body._id }, $or: [{ name: body.name }] }] })

    if (role) { throw new Error('角色已存在~') }
    return role
}

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