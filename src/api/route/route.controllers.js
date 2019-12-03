'use strict'

const Route = require('./route.model')

exports.options = async (req, res, next) => {
    const routes = await Route.find({}, 'path meta.title -_id')
    const data = routes.filter(route => route.path.indexOf('manage') > 0)
    res.json({ code: "000000", data })
}

exports.index = async (req, res, next) => {
    const sortOrder = req.body.sortOrder
    const sortField = req.body.sortField
    const pagenum = req.body.pagenum
    const pagerow = req.body.pagerow
    const filters = req.body.filters
    const reg = new RegExp(filters, 'i')

    // 按表头排序
    let sortRoute
    switch (sortField) {
        case "meta.needLogin":
            sortRoute = { "meta.needLogin": sortOrder }
            break
        case "createdAt":
            sortRoute = { createdAt: sortOrder }
            break
        case "updatedAt":
            sortRoute = { updatedAt: sortOrder }
            break

        default:
            break
    }

    const total = await Route.find({
        $or: [
            { name: { $regex: reg } },
            { path: { $regex: reg } },
            { "meta.title": { $regex: reg } },
        ]
    }).countDocuments()

    const data = await Route
        .find({
            $or: [
                { name: { $regex: reg } },
                { path: { $regex: reg } },
                { "meta.title": { $regex: reg } },
            ]
        })
        .skip(parseInt((pagenum - 1) * pagerow))
        .limit(parseInt(pagerow))
        .sort(sortRoute)

    res.json({ code: '000000', data: { total, data } })
}

exports.create = async (req, res, next) => {
    const route = new Route(req.body)
    await route.save()
    res.json({ code: '000000', data: route })
}

exports.read = async (req, res, next) => {
    const route = await Route.findById(req.body._id)
    if (!route) throw new Error('路由不存在')
    res.json({ code: '000000', data: route })
}

exports.update = async (req, res, next) => {
    const route = await Route.findByIdAndUpdate(req.body._id, req.body, { new: true })
    if(!route) throw new Error('路由不存在')    
    res.json({ code: '000000', data: route })
}

exports.delete = async (req, res, next) => {
    const route = await Route.findByIdAndDelete(req.body._id)
    if (!route) throw new Error('路由不存在')
    await route.remove()
    res.json({ code: '000000', data: route })
}