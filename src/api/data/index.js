'use strict'

const express = require('express')
const controller = require('./data.controllers')
const routeMW = require('../../middleware/routeMW')

const router = new express.Router()

router.post('/index', routeMW.aut, controller.index)
router.post('/onLED', routeMW.aut, controller.onLED)

module.exports = router