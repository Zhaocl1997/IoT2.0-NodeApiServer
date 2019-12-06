'use strict'

const express = require('express')
const controller = require('./menu.controllers')
const admin = require('../../middleware/admin')
const base = require('../../middleware/base')
const { vMenuMW, vIDMW } = require('../../middleware/validate/validate')

const router = new express.Router()

// user
router.post('/index', base, controller.index)

// admin
router.post('/options', admin, controller.options)
router.post('/create', [admin, vMenuMW], controller.create)
router.post('/read', [admin, vIDMW], controller.read)
router.post('/update', [admin, vMenuMW], controller.update)
router.post('/delete', [admin, vIDMW], controller.delete)

module.exports = router