'use strict'

const Data = require('./data.model')

/**
 * @method index
 * @param { Object } req.body
 * @return { json }
 * @description 读取指定用户的指定设备信息 || public
 */
exports.index = async (req, res, next) => {
    const sortOrder = req.body.sortOrder
    const sortField = req.body.sortField
    const pagenum = req.body.pagenum
    const pagerow = req.body.pagerow
    const filters = req.body.filters
    const reg = new RegExp(filters, 'i')

    await Data
        .find()
        .countDocuments()
        .exec(async (err, total) => {
            if (err) throw new Error(err)
            await Data
                .find()
                .skip(parseInt((pagenum - 1) * pagerow))
                .limit(parseInt(pagerow))
                .sort({ createdAt: -1 })
                .populate({
                    path: "createdBy",
                    select: "name type",
                    populate: {
                        path: "createdBy",
                        select: "name"
                    }
                })
                .lean()
                .exec((err, data) => {
                    if (err) throw new Error(err)
                    res.json({ code: "000000", data: { total, data } })
                })
        })
}

/**
 * @method onLED
 * @param { Object } req.body
 * @return { json }
 * @description 改变LED状态 || public 
 */
exports.onLED = async (req, res, next) => {
    require('../../services/mqtt').onLED(req.body)

    res.json({ code: "000000" })
}

/**
 * @method create
 * @param { Object } req.body
 * @return { json }
 * @description 删除数据 || public 
 */
exports.create = async (req, res, next) => {
    const data = new Data(req.body)
    await data.save()
    res.json({ code: '000000', data: data })
}

/**
 * @method delete
 * @param { Object } req.body
 * @return { json }
 * @description 删除数据 || public 
 */
exports.delete = async (req, res, next) => {
    const data = await Data.findByIdAndDelete(req.body._id)
    await data.remove()
    res.json({ code: '000000', data: data })
}