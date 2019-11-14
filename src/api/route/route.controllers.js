'use strict'

const Route = require('./route.model')

exports.options = async (req, res, next) => {
    const routes = await Route.find({}, 'path meta.title -_id')
    const data = routes.filter(route => route.path.indexOf('manage') > 0)
    res.json({ code: "000000", data })
}

exports.index = async (req, res, next) => {
    const routes = await Route.find()
    res.json({ code: '000000', data: routes })
}

exports.create = async (req, res, next) => {
    const route = new Route(req.body)
    await route.save()
    res.json({ code: '000000', data: route })
}

exports.read = async (req, res, next) => {

}

exports.update = async (req, res, next) => {

}

exports.delete = async (req, res, next) => {

}