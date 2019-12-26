'use strict'

const { vUser, vDev, vData, vMenu, vRole, vRoute, vId } = require('../../helper/validate')

const vUserMW = (req, res, next) => {
    const { error } = vUser(req.body);
    if (error) return next(error)
    next()
}

const vDeviceMW = (req, res, next) => {
    const { error } = vDev(req.body);
    if (error) return next(error)
    next()
}

const vDataMW = (req, res, next) => {
    const { error } = vData(req.body.macAddress);
    if (error) return next(error)
    next()
}

const vMenuMW = (req, res, next) => {
    const { error } = vMenu(req.body);
    if (error) return next(error)
    next()
}

const vRoleMW = (req, res, next) => {
    const { error } = vRole(req.body);
    if (error) return next(error)
    next()
}

const vRouteMW = (req, res, next) => {
    const { error } = vRoute(req.body);
    if (error) return next(error)
    next()
}

const vIDMW = (req, res, next) => {
    const { error } = vId(req.body._id);
    if (error) return next(error)
    next()
}

module.exports = {
    vUserMW,
    vDeviceMW,
    vDataMW,
    vMenuMW,
    vRoleMW,
    vRouteMW,
    vIDMW
}