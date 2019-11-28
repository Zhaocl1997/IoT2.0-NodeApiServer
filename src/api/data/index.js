'use strict'

const express = require('express')
const controller = require('./data.controllers')
const base = require('../../middleware/base')
const { validateDataMiddleWare } = require('../../middleware/validate/validate')

const router = new express.Router()

router.post('/index', [base, validateDataMiddleWare], controller.index)
router.post('/onLED', base, controller.onLED)

module.exports = router