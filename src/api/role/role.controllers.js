'use strict'

const Role = require('./role.model')
const { vField } = require('../../helper/validate')

/**
 * @method options
 * @param { Object }
 * @returns { data }
 * @description admin
 */
exports.options = async (req, res, next) => {
    const role = await Role.find({}, 'name describe')
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

    const sortOrder = req.body.sortOrder
    const sortField = req.body.sortField
    const pagenum = req.body.pagenum
    const pagerow = req.body.pagerow
    const filters = req.body.filters
    const reg = new RegExp(filters, 'i')

    // 排序
    let sort
    switch (sortField) {
        case "createdAt":
            sort = { createdAt: sortOrder }
            break
        case "updatedAt":
            sort = { updatedAt: sortOrder }
            break
        case "status":
            sort = { status: sortOrder }
            break

        default:
            break
    }

    // 分页
    const page = {
        skip: parseInt((pagenum - 1) * pagerow),
        limit: parseInt(pagerow)
    }

    // 查询
    const filter = {
        $or: [
            { name: { $regex: reg } },
            { describe: { $regex: reg } }
        ]
    }

    await Role
        .find(filter)
        .countDocuments()
        .exec(async (err, total) => {
            if (err) throw new Error(err)
            await Role
                .find(filter)
                .skip(page.skip)
                .limit(page.limit)
                .sort(sort)
                .populate({
                    path: 'userCount'
                })
                .lean()
                .exec((err, data) => {
                    if (err) throw new Error(err)
                    res.json({ code: "000000", data: { total, data } })
                })
        })
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

    const role = new Role(req.body)
    await role.save()
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
 * @method delete
 * @param { Object } 
 * @returns { Boolean }
 * @description admin
 */
exports.delete = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    const role = await Role.findByIdAndDelete(req.body._id)
    if (!role) throw new Error('角色不存在')
    await role.remove()
    res.json({ code: "000000", data: { data: true } })
}