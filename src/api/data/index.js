'use strict'

const express = require('express')
const controller = require('./data.controllers')
const { autMW } = require('../../middleware/routeMW')
const { vDataMW } = require('../../middleware/validateMW')

const router = new express.Router()

router.post('/index', [vDataMW, autMW], controller.index)
router.post('/onLED', autMW, controller.onLED)

module.exports = router