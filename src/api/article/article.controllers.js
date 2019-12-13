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
            { title: { $regex: base.reg } },
            { author: { $regex: base.reg } },
            { category: { $regex: base.reg } }
        ]
    }

    const total = await Article.find(filter).countDocuments()
    const data = await Article.find(filter)
        .skip(base.skip).limit(base.limit).sort(base.sort)
        .populate({ path: 'author' })
        .populate({ path: "category" })
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
    const article = new Article(req.body)
    await article.save()
    res.json({ code: "000000", data: article })
}

/**
 * @method read
 * @param { Object }
 * @returns { data }
 * @description public
 */
exports.read = async (req, res, next) => {

    const questionid = req.body.questionid


    const result = await Question.findById(questionid)
    if (!result) { throw new Error('没有找到用户信息') }

    res.json({
        code: "000000",
        data: result
    })
}

/**
 * @method update
 * @param { Object } 
 * @returns { Boolean }
 * @description public 
 */
exports.update = async (req, res, next) => {


    const questionid = req.body.questionid

    let question = await Article.findById(questionid)
    if (!question) {
        const error = new Error('没有找到信息')
        throw error
    }

    question = {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category

    }

    let result = await Article.findByIdAndUpdate(questionid, question)

    res.json({
        code: "000000",
        data: result
    })
}

/**
 * @method delete
 * @param { Object }
 * @returns { Boolean }
 * @description public
 */
exports.delete = async (req, res, next) => {
    const questionId = req.body.questionId


    let result = await Article.findByIdAndRemove(questionId)
    if (result == null) {
        const error = new Error('删除失败')
        throw error
    }
    res.json({
        code: "000000",
        data: result
    })
}