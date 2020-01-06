'use strict'

const express = require('express')
const controller = require('./userLikeArticle.controllers')
const base = require('../../middleware/base')

const router = new express.Router()

// base
router.post('/like', base, controller.like)
router.post('/unlike', base, controller.unlike)

module.exports = router