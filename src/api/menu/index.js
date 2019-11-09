'use strict'

const express = require('express')
const controller = require('./menu.controllers')
const { autMW, authMW } = require('../../middleware/routeMW')
const { vMenuMW, vIdMW } = require('../../middleware/validateMW')

const router = new express.Router()

// public
router.post('/index', autMW, controller.index)

// admin
router.post('/create', [vMenuMW, autMW, authMW], controller.create)
router.post('/read', [vIdMW, autMW, authMW], controller.read)
router.post('/update', [vMenuMW, autMW, authMW], controller.update)
router.post('/delete', [vIdMW, autMW, authMW], controller.delete)

module.exports = router