'use strict'

const express = require('express')
const con = require('./controllers')
const avatarMW = require('../../middleware/validate/avatar')
const admin = require('../../middleware/admin')
const base = require('../../middleware/base')
const { loginMW } = require('../../middleware/auth/login')
const { vUserMW, vIDMW } = require('../../middleware/validate/validate')

const router = new express.Router()

// common
router.post('/register', vUserMW, con.common.register)
router.post('/login', [loginMW, vUserMW], con.common.login)
router.post('/captcha', con.common.captcha)

// findpass
router.post('/logout', con.user.logout)
router.post('/checkExist', con.findpass.checkExist)
router.post('/sendCode', con.findpass.sendCode)
router.post('/checkCode', con.findpass.checkCode)
router.post('/resetPass', con.findpass.resetPass)

// user
router.post('/read', [base, vIDMW], con.user.read)
router.post('/avatar', [base, avatarMW], con.user.avatar)
router.post('/weather', base, con.user.weather)
router.post('/updateInfo', [base, vUserMW], con.user.updateInfo)
router.post('/changePass', base, con.user.changePass)
router.post('/unlock', base, con.user.unlock)

// admin
router.post('/options', admin, con.admin.options)
router.post('/index', admin, con.admin.index)
router.post('/create', [admin, vUserMW], con.admin.create)
router.post('/update', [admin, vUserMW], con.admin.update)
router.post('/updateStatus', [admin, vUserMW], con.admin.updateStatus)
router.post('/delete', [admin, vIDMW], con.admin.delete)
router.post('/deleteMany', [admin, vIDMW], con.admin.deleteMany)

module.exports = router