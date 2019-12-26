'use strict'

const Role = require('./role.model')
const { vField } = require('../../helper/validate')
const { index_params } = require('../../helper/public')

/**
 * @method options
 * @param { Object }
 * @returns { data }
 * @description admin
 */
exports.options = async (req, res, next) => {
    const role = await Role.find({}, 'describe')
    res.json({ code: "000000", data: { data: role } })
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
            { describe: { $regex: base.reg } }
        ]
    }

    const total = await Role.find(filter).countDocuments()
    const data = await Role.find(filter)
        .skip(base.skip).limit(base.limit).sort(base.sort)
        .populate({ path: 'userCount' })
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
    vField(req.body, ["name", "describe", "menu"])

    // 根据name查找用户 解决name唯一问题
    await Role.isExist(req.body)

    await Role.create(req.body)
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method read
 * @param { Object }
 * @returns { data }
 * @description admin
 */
exports.read = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    const role = await Role.findById(req.body._id)
    if (!role) throw new Error('角色不存在')
    res.json({ code: '000000', data: { data: role } })
}

/**
 * @method update
 * @param { Object } 
 * @returns { Boolean }
 * @description admin
 */
exports.update = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id", "name", "describe", "menu"])

    // 根据name查找用户 解决name唯一问题
    await Role.isExist(req.body)

    const role = await Role.findByIdAndUpdate(req.body._id, req.body, { new: true })
    if (!role) throw new Error('角色不存在')
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

    const role = await Role.findById(req.body._id)
    if (!role) throw new Error('角色不存在')
    role.status = req.body.status
    await role.save()
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

    const role = await Role.findById(req.body._id)
    if (!role) throw new Error('角色不存在')
    await role.remove()
    res.json({ code: "000000", data: { data: true } })
}