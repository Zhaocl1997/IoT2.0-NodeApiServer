'use strict'

const Article = require('../article/article.model')
const UserLikeArticle = require('./userLikeArticle.model')
const { vField } = require('../../helper/validate')

/**
 * @method like
 * @param { Object }
 * @returns { Boolean }
 * @description user 
 */
exports.like = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["articleId"])

    const article = await Article.findById(req.body.articleId)
    article.like += 1
    await article.save()

    await UserLikeArticle.create({
        articleId: req.body.articleId,
        userId: req.user._id
    })

    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method unlike
 * @param { Object }
 * @returns { Boolean }
 * @description user 
 */
exports.unlike = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["articleId"])

    const article = await Article.findById(req.body.articleId)
    article.like -= 1
    await article.save()

    await UserLikeArticle.deleteOne({
        articleId: req.body.articleId,
        userId: req.user._id
    })

    res.json({ code: "000000", data: { data: true } })
}