'use strict'

const Logger = require('./logger.model')
const { vField } = require('../../helper/validate')
const { index_params } = require('../../helper/public')

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
            { method: { $regex: base.reg } },
            { url: { $regex: base.reg } }
        ]
    }

    const total = await Logger.find(filter).countDocuments()
    const data = await Logger.find(filter)
        .skip(base.skip).limit(base.limit).sort(base.sort).lean()
    res.json({ code: "000000", data: { total, data } })
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

    const log = await Logger.findById(req.body._id)
    if (!log) throw new Error('记录不存在')
    await log.remove()
    res.json({ code: "000000", data: { data: true } })
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

    await Logger.deleteMany({ _id: { $in: req.body._id } })

    res.json({ code: "000000", data: { data: true } })
}