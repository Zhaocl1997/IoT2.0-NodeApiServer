'use strict'

const {
    vUser,
    vDev,
    vData,
    vMenu,
    vRole,
    vRoute,
    vId
} = require('../helper/validate')

function vUserMW(req, res, next) {
    const { error } = vUser(req.body);
    if (error) {
        return next(error)
    } else {
        next()
    }
}

function vDevMW(req, res, next) {
    const { error } = vDev(req.body);
    if (error) {
        return next(error)
    } else {
        next()
    }
}

function vDataMW(req, res, next) {
    const { error } = vData(req.body.macAddress);
    if (error) {
        return next(error)
    } else {
        next()
    }
}

function vMenuMW(req, res, next) {
    const { error } = vMenu(req.body);
    if (error) {
        return next(error)
    } else {
        next()
    }
}

function vRoleMW(req, res, next) {
    const { error } = vRole(req.body);
    if (error) {
        return next(error)
    } else {
        next()
    }
}

function vRouteMW(req, res, next) {
    const { error } = vRoute(req.body);
    if (error) {
        return next(error)
    } else {
        next()
    }
}

function vIdMW(req, res, next) {
    const { error } = vId(req.body.id);
    if (error) {
        return next(error)
    } else {
        next()
    }
}

module.exports = {
    vUserMW,
    vDevMW,
    vDataMW,
    vMenuMW,
    vRoleMW,
    vRouteMW,
    vIdMW
}