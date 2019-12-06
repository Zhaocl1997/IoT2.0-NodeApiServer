'use strict'

const express = require('express')
const controller = require('./article.controllers')
const admin = require('../../middleware/admin')

const router = new express.Router()

// admin
router.post('/index', admin, controller.index)
router.post('/create', admin, controller.create)
router.post('/read', admin, controller.read)
router.post('/update', admin, controller.update)
router.post('/delete', admin, controller.delete)

module.exports = router