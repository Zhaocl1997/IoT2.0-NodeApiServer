'use strict'

const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    intro: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tag: {
        type: Array,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    like: {
        type: Number,
        default: 0
    },
    read: {
        type: Number,
        default: 0
    },
    flag: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
})

/**
 * 虚拟属性,对应user_like_article
 */
articleSchema.virtual('isLiked', {
    ref: 'UserLikeArticle',
    localField: '_id',
    foreignField: 'articleId'
})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article