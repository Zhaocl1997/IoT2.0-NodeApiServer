'use strict'

const express = require('express')
const controller = require('./user.controllers')
const registerMiddleWare = require('../../middleware/auth/register')
const loginMiddleWare = require('../../middleware/auth/login')
const avatarMiddleWare = require('../../middleware/validate/avatar')
const admin = require('../../middleware/admin')
const base = require('../../middleware/base')
const { validateUserMiddleWare, validateIDMiddleWare } = require('../../middleware/validate/validate')

const router = new express.Router()

// public
router.post('/register', registerMiddleWare, controller.register)
router.post('/login', loginMiddleWare, controller.login)
router.post('/logout', controller.logout)
router.post('/captcha', controller.captcha)

router.post('/avatar', [base, avatarMiddleWare], controller.avatar)
router.post('/read', [base, validateIDMiddleWare], controller.read)
router.post('/update', [base, validateUserMiddleWare], controller.update)
router.post('/weather', base, controller.weather)

// admin
router.post('/options', admin, controller.options)
router.post('/index', admin, controller.index)
router.post('/create', [admin, validateUserMiddleWare], controller.create)
router.post('/delete', [admin, validateIDMiddleWare], controller.delete)

module.exports = router