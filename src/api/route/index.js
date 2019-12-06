'use strict'

const express = require('express')
const controller = require('./route.controllers')
const admin = require('../../middleware/admin')
const { vRouteMW, vIDMW } = require('../../middleware/validate/validate')

const router = new express.Router()

// public 
router.post('/index', controller.index)

// admin
router.post('/options', admin, controller.options)
router.post('/create', [admin, vRouteMW], controller.create)
router.post('/read', [admin, vIDMW], controller.read)
router.post('/update', [admin, vRouteMW], controller.update)
router.post('/delete', [admin, vIDMW], controller.delete)

module.exports = router