'use strict'

const express = require('express')
const controller = require('./user.controllers')
const { autMW, authMW, uSMW, rSMW } = require('../../middleware/routeMW')
const { vUserMW, vIdMW } = require('../../middleware/validateMW')
const { avatar } = require('../../middleware/upload')

const router = new express.Router()

// public
router.post('/register', vUserMW, controller.register)
router.post('/login', [vUserMW, rSMW, uSMW], controller.login)
router.post('/logout', controller.logout)
router.post('/captcha', controller.captcha)
router.post('/avatar', [autMW, avatar], controller.avatar)
router.post('/read', [vIdMW, autMW], controller.read)
router.post('/update', [vUserMW, autMW], controller.update)

// admin
router.post('/index', [autMW, authMW], controller.index)
router.post('/create', [vUserMW, autMW, authMW], controller.create)
router.post('/delete', [vIdMW, autMW, authMW], controller.delete)

module.exports = router