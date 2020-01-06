'use strict'

const express = require('express')
const controller = require('./article.controllers')
const base = require('../../middleware/base')

const router = new express.Router()

// public
router.post('/index', controller.index)
router.post('/read', controller.read)

// base
router.post('/create', base, controller.create)
router.post('/update', base, controller.update)
router.post('/delete', base, controller.delete)

module.exports = router