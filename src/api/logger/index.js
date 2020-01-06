'use strict'

const express = require('express')
const controller = require('./logger.controllers')
const admin = require('../../middleware/admin')

const router = new express.Router()

// admin
router.post('/index', admin, controller.index)
router.post('/delete', admin, controller.delete)
router.post('/deleteMany', admin, controller.deleteMany)

module.exports = router