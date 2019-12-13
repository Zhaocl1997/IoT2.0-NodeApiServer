'use strict'

const express = require('express')
const controller = require('./device.controllers')
const base = require('../../middleware/base')
const { vDeviceMW, vIDMW } = require('../../middleware/validate/validate')

const router = new express.Router()

// user
router.post('/options', base, controller.options)
router.post('/index', base, controller.index)
router.post('/create', [base, vDeviceMW], controller.create)
router.post('/read', [base, vIDMW], controller.read)
router.post('/update', [base, vDeviceMW], controller.update)
router.post('/updateStatus', [base, vDeviceMW], controller.updateStatus)
router.post('/delete', [base, vIDMW], controller.delete)

module.exports = router