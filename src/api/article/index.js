'use strict'

const express = require('express')
const controller = require('./article.controllers')
const base = require('../../middleware/base')

const router = new express.Router()

// base
router.post('/index', base, controller.index)
router.post('/create', base, controller.create)
router.post('/read', base, controller.read)
router.post('/update', base, controller.update)
router.post('/delete', base, controller.delete)

module.exports = router