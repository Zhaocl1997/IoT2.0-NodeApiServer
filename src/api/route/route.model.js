'use strict'

const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    meta: {
        type: Object,
        required: true
    },
    component: {
        type: String,
        required: true
    },
    package: {
        type: String,
        required: true
    },
}, {
    versionKey: false
})

const Route = mongoose.model('Route', routeSchema)

module.exports = Route