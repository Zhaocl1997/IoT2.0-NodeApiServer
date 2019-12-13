'use strict'

const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subs: [{
        name: {
            type: String,
            required: true
        },
        subs: [{
            name: {
                type: String,
                required: true
            }
        }]
    }],
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
    foreignField: 'category'
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category