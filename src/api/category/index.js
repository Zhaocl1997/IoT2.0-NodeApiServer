'use strict'

const express = require('express')
const controller = require('./category.controllers')
const admin = require('../../middleware/admin')
const base = require('../../middleware/base')

const router = new express.Router()

// base
router.post('/options', base, controller.options)

// admin
router.post('/index', admin, controller.index)
router.post('/create', admin, controller.create)
router.post('/read', admin, controller.read)
router.post('/update', admin, controller.update)

module.exports = router