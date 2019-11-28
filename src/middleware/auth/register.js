'use strict'

const { validateUserMiddleWare } = require('../validate/validate')

const registerMiddleWare = [validateUserMiddleWare]

module.exports = registerMiddleWare