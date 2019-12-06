'use strict'

const express = require('express')
const controller = require('./user.controllers')
const registerMW = require('../../middleware/auth/register')
const loginMW = require('../../middleware/auth/login')
const avatarMW = require('../../middleware/validate/avatar')
const admin = require('../../middleware/admin')
const base = require('../../middleware/base')
const { vUserMW, vIDMW } = require('../../middleware/validate/validate')

const router = new express.Router()

// public
router.post('/register', registerMW, controller.register)
router.post('/login', loginMW, controller.login)
router.post('/logout', controller.logout)
router.post('/captcha', controller.captcha)

// user
router.post('/avatar', [base, avatarMW], controller.avatar)
router.post('/weather', base, controller.weather)
router.post('/read', [base, vIDMW], controller.read)
router.post('/update', [base, vUserMW], controller.update)

// admin
router.post('/options', admin, controller.options)
router.post('/index', admin, controller.index)
router.post('/create', [admin, vUserMW], controller.create)
router.post('/delete', [admin, vIDMW], controller.delete)

module.exports = router