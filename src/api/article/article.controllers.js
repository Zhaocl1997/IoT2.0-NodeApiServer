'use strict'

const Article = require('./article.model')
const { vField } = require('../../helper/validate')
const { index_params } = require('../../helper/public')

/**
 * @method index
 * @param { Object } 
 * @returns { data }
 * @description public 
 */
exports.index = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["sortOrder", "sortField", "pagenum", "pagerow", "filters"])

    const base = index_params(req.body)

    // 查询
    const filter = {
        $or: [
            { title: { $regex: base.reg } }
        ]
    }

    const total = await Article.find(filter).countDocuments()
    const data = await Article.find(filter)
        .skip(base.skip).limit(base.limit).sort(base.sort)
        .populate({ path: 'author', select: 'name' })
        .populate({ path: "category", select: 'name' })
        .lean()

    res.json({ code: "000000", data: { total, data } })
}

/**
 * @method create
 * @param { Object }
 * @returns { Boolean }
 * @description public 
 */
exports.create = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["title", "tag", "category", "content"])

    await Article.create({
        ...req.body,
        author: req.user._id
    })
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method read
 * @param { Object }
 * @returns { data }
 * @description public
 */
exports.read = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    const article = await Article.findById(req.body._id)
    if (!article) throw new Error('文章不存在')
    res.json({ code: '000000', data: { data: article } })
}

/**
 * @method update
 * @param { Object } 
 * @returns { Boolean }
 * @description public 
 */
exports.update = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id", "title", "category", "tag", "content"])

    const article = await Article.findOneAndUpdate({
        _id: req.body._id,
        author: req.user._id
    }, req.body, { new: true })
    if (!article) throw new Error('文章不存在')
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method delete
 * @param { Object }
 * @returns { Boolean }
 * @description public
 */
exports.delete = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    const article = await Article.findOne({
        _id: req.body._id,
        author: req.user._id
    })
    if (!article) throw new Error('文章不存在')
    await article.remove()
    res.json({ code: "000000", data: { data: true } })
}