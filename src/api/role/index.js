'use strict'

const express = require('express')
const controller = require('./role.controllers')
const { autMW, authMW } = require('../../middleware/routeMW')
const { vRoleMW, vIdMW } = require('../../middleware/validateMW')

const router = new express.Router()

// admin
router.post('/options', [autMW, authMW], controller.options)
router.post('/index', [autMW, authMW], controller.index)
router.post('/create', [vRoleMW, autMW, authMW], controller.create)
router.post('/read', [vIdMW, autMW, authMW], controller.read)
router.post('/update', [vRoleMW, autMW, authMW], controller.update)
router.post('/delete', [vIdMW, autMW, authMW], controller.delete)

module.exports = router