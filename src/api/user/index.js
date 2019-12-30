'use strict'

const express = require('express')
const controller = require('./user.controllers')
const avatarMW = require('../../middleware/validate/avatar')
const admin = require('../../middleware/admin')
const base = require('../../middleware/base')
const { loginMW } = require('../../middleware/auth/login')
const { vUserMW, vIDMW } = require('../../middleware/validate/validate')

const router = new express.Router()

// public
router.post('/register', vUserMW, controller.register)
router.post('/login', [vUserMW, loginMW], controller.login)
router.post('/gencode', controller.gencode)
router.post('/findpass', controller.findpass)
router.post('/logout', controller.logout)
router.post('/captcha', controller.captcha)

// user
router.post('/avatar', [base, avatarMW], controller.avatar)
router.post('/weather', base, controller.weather)
router.post('/read', [base, vIDMW], controller.read)
router.post('/updateInfo', [base, vUserMW], controller.updateInfo)
router.post('/changePass', base, controller.changePass)
router.post('/unlock', base, controller.unlock)

// admin
router.post('/options', admin, controller.options)
router.post('/index', admin, controller.index)
router.post('/create', [admin, vUserMW], controller.create)
router.post('/update', [admin, vUserMW], controller.update)
router.post('/updateStatus', [admin, vUserMW], controller.updateStatus)
router.post('/delete', [admin, vIDMW], controller.delete)
router.post('/deleteMany', [admin, vIDMW], controller.deleteMany)

module.exports = router