'use strict'

const Category = require('./category.model')
const { vField } = require('../../helper/validate')
const { toTreeData, toTreeSub } = require('../../helper/public')

/**
 * @method options
 * @param { null } 
 * @returns { data }
 * @description admin 
 */
exports.options = async (req, res, next) => {
    const data = await Category.find({ name: { $ne: 'root' } }, '_id name parentID')
    const root = await Category.findOne({ name: "root" })
    const arr = toTreeData(data, root._id.toString())
    const result = toTreeSub(arr)
    res.json({ code: "000000", data: { data: result } })
}

/**
 * @method index
 * @param { null } 
 * @returns { data }
 * @description admin 
 */
exports.index = async (req, res, next) => {
    const data = await Category.find({ name: { $ne: 'root' } }).populate('articles')
    const root = await Category.findOne({ name: "root" })
    const result = toTreeData(data, root._id.toString())
    res.json({ code: "000000", data: { data: result } })
}

/**
 * @method create
 * @param { Object } 
 * @returns { Boolean }
 * @description admin 
 */
exports.create = async (req, res, next) => {
    if (!req.body.parentID) {
        // 验证字段
        vField(req.body, ["name", "key", "desc"])
        const root = await Category.findOne({ name: 'root' })
        await Category.create({
            ...req.body,
            parentID: root._id
        })
        res.json({ code: "000000", data: { data: true } })
    } else {
        // 验证字段
        vField(req.body, ["name", "key", "desc", "parentID"])
        await Category.create(req.body)
        res.json({ code: "000000", data: { data: true } })
    }
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

    const category = await Category.findById(req.body._id)
    if (!category) throw new Error('分类不存在')
    res.json({ code: '000000', data: { data: category } })
}

/**
 * @method update
 * @param { Object } 
 * @returns { Boolean }
 * @description admin 
 */
exports.update = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id", "name", "key", "desc"])

    const category = await Category.findByIdAndUpdate(req.body._id, req.body, { new: true })
    if (!category) throw new Error('分类不存在')
    res.json({ code: "000000", data: { data: true } })
}