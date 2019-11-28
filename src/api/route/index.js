'use strict'

const express = require('express')
const controller = require('./route.controllers')
const admin = require('../../middleware/admin')
const { validateRouteMiddleWare, validateIDMiddleWare } = require('../../middleware/validate/validate')

const router = new express.Router()

// public 
router.post('/index', controller.index)

// admin
router.post('/options', admin, controller.options)
router.post('/create', [admin, validateRouteMiddleWare], controller.create)
router.post('/read', [admin, validateIDMiddleWare], controller.read)
router.post('/update', [admin, validateRouteMiddleWare], controller.update)
router.post('/delete', [admin, validateIDMiddleWare], controller.delete)

module.exports = router