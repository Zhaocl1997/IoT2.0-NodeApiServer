'use strict'

const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    parentID: {
        type: mongoose.Schema.Types.ObjectId
    },
    flag: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
})

categorySchema.virtual('articles', {
    ref: 'Article',
    localField: '_id',
    foreignField: 'category',
    count: true
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category