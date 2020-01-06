'use strict'

const User = require('../user.model')
const { vField } = require('../../../helper/validate')
const { index_params } = require('../../../helper/public')

/**
 * @method options
 * @param { Object }
 * @returns { data }
 * @description admin
 */
exports.options = async (req, res, next) => {
    const data = await User.find({}, 'name')
    res.json({ code: "000000", data: { data } });
}

/**
 * @method index
 * @param { Object } 
 * @returns { data }
 * @description admin
 */
exports.index = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["sortOrder", "sortField", "pagenum", "pagerow", "filters"])

    const base = index_params(req.body)

    // 查询
    const filter = {
        $or: [
            { name: { $regex: base.reg } },
            { email: { $regex: base.reg } },
            { phone: { $regex: base.reg } },
        ]
    }

    const total = await User.find(filter).countDocuments()
    const data = await User.find(filter)
        .skip(base.skip).limit(base.limit).sort(base.sort)
        .populate({ path: 'devCount' })
        .populate({ path: 'role', select: 'name' })
        .lean()

    res.json({ code: "000000", data: { total, data } })
}

/**
 * @method create
 * @param { Object }
 * @returns { Boolean }
 * @description admin 
 */
exports.create = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["name", "password", "email", "phone", "role"])

    // 根据email或phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    await User.create(req.body)
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method update
 * @param { Object } 
 * @returns { Boolean }
 * @description admin 
 */
exports.update = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id", "name", "email", "phone", "role"])

    // 根据email/phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    const user = await User.findByIdAndUpdate(req.body._id, req.body, { new: true })
    if (!user) throw new Error('用户不存在')
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method updateStatus
 * @param { Object } 
 * @returns { Boolean }
 * @description admin 
 */
exports.updateStatus = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id", "status"])

    const user = await User.findById(req.body._id)
    if (!user) throw new Error('用户不存在')
    user.status = req.body.status
    await user.save()
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method delete
 * @param { Object } 
 * @returns { Boolean }
 * @description admin
 */
exports.delete = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    const user = await User.findById(req.body._id)
    if (!user) throw new Error('用户不存在')
    await user.remove()
    res.json({ code: '000000', data: { data: true } })
}

/**
 * @method deleteMany
 * @param { Object } 
 * @returns { Boolean }
 * @description admin
 */
exports.deleteMany = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    const users = await User.find({ _id: { $in: req.body._id } })
    if (users.length !== req.body._id.length) throw new Error('删除失败')

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        await user.remove() // 触发钩子逻辑删除连带设备
    }
    res.json({ code: '000000', data: { data: true } })
}