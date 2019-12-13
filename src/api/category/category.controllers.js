'use strict'

const Category = require('./category.model')

/**
 * @method index
 * @param { Object } 
 * @returns { data }
 * @description admin 
 */
exports.index = async (req, res, next) => {
    const data = await Category.find().populate({ path: "articles" }).lean()

    for (let i = 0; i < data.length; i++) {
        const cat = data[i];

    }
}

exports.create = async (req, res, next) => {
    if (req.body._id) {
        const category = await Category.findById(req.body._id)
        delete req.body._id
        category.subs.push(req.body)
        await category.save()
        res.json({ code: "000000", data: { data: category } })
    } else {
        const category = new Category(req.body)
        await category.save()
        res.json({ code: "000000", data: { data: category } })
    }
}