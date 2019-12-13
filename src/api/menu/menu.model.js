'use strict'

const mongoose = require('mongoose')

const submenuSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // 必须
    },
    icon: {
        type: String,
        required: true // 必须
    },
    index: {
        type: String,
        required: true // 必须
    },
}, {
    versionKey: false,
    timestamps: true
});

const menuSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // 必须
    },
    icon: {
        type: String,
        required: true // 必须
    },
    index: {
        type: String,
        required: true // 必须
    },
    subs: [submenuSchema],
}, {
    versionKey: false,
    timestamps: true
});

const Menu = mongoose.model('Menu', menuSchema)

module.exports = Menu