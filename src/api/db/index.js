'use strict'

const express = require('express')
const controller = require('./db.controllers')
const admin = require('../../middleware/admin')

const router = new express.Router()

// admin
router.post('/index', admin, controller.index)
router.post('/export', admin, controller.export)
router.post('/list', admin, controller.list)
router.post('/import', admin, controller.import)

module.exports = router