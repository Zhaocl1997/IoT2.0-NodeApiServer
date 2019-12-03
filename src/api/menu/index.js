'use strict'

const express = require('express')
const controller = require('./menu.controllers')
const admin = require('../../middleware/admin')
const base = require('../../middleware/base')
const { validateMenuMiddleWare, validateIDMiddleWare } = require('../../middleware/validate/validate')

const router = new express.Router()

// public
router.post('/index', base, controller.index)

// admin
router.post('/options', admin, controller.options)
router.post('/create', [admin, validateMenuMiddleWare], controller.create)
router.post('/read', [admin, validateIDMiddleWare], controller.read)
router.post('/update', [admin, validateMenuMiddleWare], controller.update)
router.post('/delete', [admin, validateIDMiddleWare], controller.delete)

module.exports = router