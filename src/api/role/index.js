'use strict'

const express = require('express')
const controller = require('./role.controllers')
const routeMW = require('../../middleware/routeMW')

const router = new express.Router()

// admin
router.post('/options', [routeMW.aut, routeMW.auth], controller.options)
router.post('/index', [routeMW.aut, routeMW.auth], controller.index)
router.post('/create', [routeMW.aut, routeMW.auth], controller.create)
router.post('/read', [routeMW.aut, routeMW.auth], controller.read)
router.post('/update', [routeMW.aut, routeMW.auth], controller.update)
router.post('/delete', [routeMW.aut, routeMW.auth], controller.delete)

module.exports = router