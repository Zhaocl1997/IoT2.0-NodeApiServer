'use strict'

const Route = require('./route.model')
const { vField } = require('../../helper/validate')
const { index_params } = require('../../helper/public')

/**
 * @method options
 * @param { Object }
 * @returns { data }
 * @description admin
 */
exports.options = async (req, res, next) => {
    const data = await Route.find()
    res.json({ code: "000000", data: { data } })
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
            { path: { $regex: base.reg } },
            { "meta.title": { $regex: base.reg } },
        ]
    }

    const total = await Route.find(filter).countDocuments()
    const data = await Route.find(filter).skip(base.skip).limit(base.limit).sort(base.sort)
    res.json({ code: '000000', data: { total, data } })
}

/**
 * @method create
 * @param { Object }
 * @returns { Boolean }
 * @description admin 
 */
exports.create = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["name", "path", "meta", "package", "component"])

    await Route.create(req.body)
    res.json({ code: '000000', data: { data: true } })
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

    const route = await Route.findById(req.body._id)
    if (!route) throw new Error('路由不存在')
    res.json({ code: '000000', data: { data: route } })
}

/**
 * @method update
 * @param { Object } 
 * @returns { Boolean }
 * @description admin 
 */
exports.update = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id", "name", "path", "meta", "package", "component"])

    const route = await Route.findByIdAndUpdate(req.body._id, req.body, { new: true })
    if (!route) throw new Error('路由不存在')
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method updateNeedLogin
 * @param { Object } 
 * @returns { Boolean }
 * @description admin 
 */
exports.updateNeedLogin = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id", "meta"])

    const route = await Route.findByIdAndUpdate(req.body._id, req.body, { new: true })
    if (!route) throw new Error('路由不存在')
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

    const route = await Route.findById(req.body._id)
    if (!route) throw new Error('路由不存在')
    await route.remove()
    res.json({ code: '000000', data: { data: true } })
}