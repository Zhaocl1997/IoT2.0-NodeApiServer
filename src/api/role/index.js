'use strict'

const express = require('express')
const controller = require('./role.controllers')
const admin = require('../../middleware/admin')
const { validateRoleMiddleWare, validateIDMiddleWare } = require('../../middleware/validate/validate')

const router = new express.Router()

// admin
router.post('/options', admin, controller.options)
router.post('/index', admin, controller.index)
router.post('/create', [admin, validateRoleMiddleWare], controller.create)
router.post('/read', [admin, validateIDMiddleWare], controller.read)
router.post('/update', [admin, validateRoleMiddleWare], controller.update)
router.post('/delete', [admin, validateIDMiddleWare], controller.delete)

module.exports = router