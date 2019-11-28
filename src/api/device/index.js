'use strict'

const express = require('express')
const controller = require('./device.controllers')
const base = require('../../middleware/base')
const { validateDeviceMiddleWare, validateIDMiddleWare } = require('../../middleware/validate/validate')

const router = new express.Router()

// public
router.post('/index', base, controller.index)
router.post('/create', [base, validateDeviceMiddleWare], controller.create)
router.post('/read', [base, validateIDMiddleWare], controller.read)
router.post('/update', [base, validateDeviceMiddleWare], controller.update)
router.post('/delete', [base, validateIDMiddleWare], controller.delete)

module.exports = router