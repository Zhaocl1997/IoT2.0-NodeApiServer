'use strict'

const express = require('express')
const controller = require('./menu.controllers')
const routeMW = require('../../middleware/routeMW')

const router = new express.Router()

// public
router.post('/index', routeMW.aut, controller.index)

// admin
router.post('/create', [routeMW.aut, routeMW.auth], controller.create)
router.post('/read', [routeMW.aut, routeMW.auth], controller.read)
router.post('/update', [routeMW.aut, routeMW.auth], controller.update)
router.post('/delete', [routeMW.aut, routeMW.auth], controller.delete)

module.exports = router