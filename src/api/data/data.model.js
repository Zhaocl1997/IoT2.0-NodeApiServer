'use strict'

const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    data: {
        type: mongoose.Mixed,
        required: true // 必须
    },
    flag: {
        type: Boolean,
        default: false
    },
    cB: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // 必须
        ref: 'Device'
    }
}, {
    timestamps: {
        createdAt: 'cA',
        updatedAt: false
    },
    versionKey: false
})

const Data = mongoose.model('Data', dataSchema)

module.exports = Data