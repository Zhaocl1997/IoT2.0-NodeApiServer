'use strict'

const { vUser, vDev, vData, vMenu, vRole, vRoute, vId } = require('../../helper/validate')

function validateUserMiddleWare(req, res, next) {
    const { error } = vUser(req.body);
    if (error) return next(error)
    next()
}

function validateDeviceMiddleWare(req, res, next) {
    const { error } = vDev(req.body);
    if (error) return next(error)
    next()
}

function validateDataMiddleWare(req, res, next) {
    const { error } = vData(req.body.macAddress);
    if (error) return next(error)
    next()
}

function validateMenuMiddleWare(req, res, next) {
    const { error } = vMenu(req.body);
    if (error) return next(error)
    next()
}

function validateRoleMiddleWare(req, res, next) {
    const { error } = vRole(req.body);
    if (error) return next(error)
    next()
}

function validateRouteMiddleWare(req, res, next) {
    const { error } = vRoute(req.body);
    if (error) return next(error)
    next()
}

function validateIDMiddleWare(req, res, next) {
    const { error } = vId(req.body.id);
    if (error) return next(error)
    next()
}

module.exports = {
    validateUserMiddleWare,
    validateDeviceMiddleWare,
    validateDataMiddleWare,
    validateMenuMiddleWare,
    validateRoleMiddleWare,
    validateRouteMiddleWare,
    validateIDMiddleWare
}