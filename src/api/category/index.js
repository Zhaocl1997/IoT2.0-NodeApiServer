'use strict'

const express = require('express')
const controller = require('./category.controllers')
const admin = require('../../middleware/admin')

const router = new express.Router()

// admin
router.post('/index', admin, controller.index)
router.post('/create', admin, controller.create)

module.exports = router