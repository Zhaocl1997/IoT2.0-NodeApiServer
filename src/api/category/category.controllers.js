'use strict'

const Category = require('./category.model')
const Article = require('../article/article.model')

exports.index = async (req, res, next) => {
    await Category
        .find()
        .populate({ path: "articles" })
        .lean()
        .exec((err, category) => {
            res.json({ code: "000000", data: { data: category } })
        })
}

exports.create = async (req, res, next) => {
    const category = new Category(req.body)
    await category.save()
    res.json({ code: "000000", data: { data: category } })
}