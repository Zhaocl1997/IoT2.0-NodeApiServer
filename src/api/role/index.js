'use strict'

const express = require('express')
const controller = require('./role.controllers')
const admin = require('../../middleware/admin')
const { vRoleMW, vIDMW } = require('../../middleware/validate/validate')

const router = new express.Router()

// admin
router.post('/options', admin, controller.options)
router.post('/index', admin, controller.index)
router.post('/create', [admin, vRoleMW], controller.create)
router.post('/read', [admin, vIDMW], controller.read)
router.post('/update', [admin, vRoleMW], controller.update)
router.post('/delete', [admin, vIDMW], controller.delete)

module.exports = router