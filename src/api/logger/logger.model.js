'use strict'

const mongoose = require('mongoose')

const loggerSchema = new mongoose.Schema({
    method: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    httpVersion: {
        type: Number,
        required: true
    },
    statusCode: {
        type: Number,
        required: true
    },
    referrer: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    remoteAddress: {
        type: String,
        required: true
    },
    requestTime: {
        type: Date,
        required: true
    },
    responseTime: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    }
}, {
    versionKey: false
})

const Logger = mongoose.model('Logger', loggerSchema)

module.exports = Logger