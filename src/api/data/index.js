'use strict'

const express = require('express')
const controller = require('./data.controllers')
const base = require('../../middleware/base')
const admin = require('../../middleware/admin')
const { vDataMW } = require('../../middleware/validate/validate')

const router = new express.Router()

// user
router.post('/index', base, controller.index)
router.post('/indexByMac', base, controller.indexByMac)
router.post('/onLED', [base, vDataMW], controller.onLED)

// admin
router.post('/create', admin, controller.create)
router.post('/delete', admin, controller.delete)
router.post('/deleteMany', admin, controller.deleteMany)

module.exports = router