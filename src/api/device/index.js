'use strict'

const express = require('express')
const controller = require('./device.controllers')
const { autMW } = require('../../middleware/routeMW')
const { vDevMW, vIdMW } = require('../../middleware/validateMW')

const router = new express.Router()

// public
router.post('/index', autMW, controller.index)
router.post('/create', [vDevMW, autMW], controller.create)
router.post('/read', [vIdMW, autMW], controller.read)
router.post('/update', [vDevMW, autMW], controller.update)
router.post('/delete', [vIdMW, autMW], controller.delete)

module.exports = router