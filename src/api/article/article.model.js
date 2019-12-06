'use strict'

const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    title: {
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
        type: Number,
        required: true,
        ref: 'Category'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    solve: {
        type: Number,
        default: 0
    },
    unsolve: {
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

const Article = mongoose.model('Article', articleSchema)

module.exports = Article