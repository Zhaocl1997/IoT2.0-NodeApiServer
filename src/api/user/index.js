'use strict'

const express = require('express')
const controller = require('./user.controllers')
const routeMW = require('../../middleware/routeMW')

const router = new express.Router()

// public
router.post('/register', controller.register)
router.post('/login', [routeMW.roleStatus, routeMW.userStatus], controller.login)
router.post('/logout', controller.logout)
router.post('/captcha', controller.captcha)

// admin
router.post('/index', [routeMW.aut, routeMW.auth], controller.index)
router.post('/create', [routeMW.aut, routeMW.auth], controller.create)
router.post('/read', [routeMW.aut, routeMW.auth], controller.read)
router.post('/update', [routeMW.aut, routeMW.auth], controller.update)
router.post('/delete', [routeMW.aut, routeMW.auth], controller.delete)

module.exports = router