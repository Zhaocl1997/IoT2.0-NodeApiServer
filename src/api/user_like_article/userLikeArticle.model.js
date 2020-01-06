'use strict'

const mongoose = require('mongoose')

const userLikeArticleSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Article'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, {
    timestamps: false,
    versionKey: false
})

const UserLikeArticle = mongoose.model('UserLikeArticle', userLikeArticleSchema)

module.exports = UserLikeArticle