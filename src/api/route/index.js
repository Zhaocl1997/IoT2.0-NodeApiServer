'use strict'

const express = require('express')
const controller = require('./route.controllers')
const { autMW, authMW } = require('../../middleware/routeMW')
const { vRouteMW, vIdMW } = require('../../middleware/validateMW')

const router = new express.Router()

// admin
router.post('/options', [autMW, authMW], controller.options)
router.post('/index', controller.index)
router.post('/create', [vRouteMW, autMW, authMW], controller.create)
router.post('/read', [vIdMW, autMW, authMW], controller.read)
router.post('/update', [vRouteMW, autMW, authMW], controller.update)
router.post('/delete', [vIdMW, autMW, authMW], controller.delete)

module.exports = router