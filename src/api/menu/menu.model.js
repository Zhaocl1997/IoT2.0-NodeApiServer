'use strict'

const mongoose = require('mongoose')

const submenuSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true
    },
    index: {
        type: String,
        required: true,
    },
}, {
    versionKey: false
});

const menuSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true
    },
    index: {
        type: String,
        required: true,
    },
    subs: [submenuSchema],
}, {
    versionKey: false
});

const Menu = mongoose.model('Menu', menuSchema)

module.exports = Menu