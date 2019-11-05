'use strict'

const express = require('express')
const controller = require('./device.controllers')
const routeMW = require('../../middleware/routeMW')

const router = new express.Router()

// public
router.post('/index', routeMW.aut, controller.index)
router.post('/create', routeMW.aut, controller.create)
router.post('/read', routeMW.aut, controller.read)
router.post('/update', routeMW.aut, controller.update)
router.post('/delete', routeMW.aut, controller.delete)

module.exports = router