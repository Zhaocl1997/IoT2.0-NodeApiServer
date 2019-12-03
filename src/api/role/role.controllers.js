'use strict'

const Role = require('./role.model')

/**
 * @method options
 * @param { Object } req.body
 * @return { json }
 * @description admin
 */
exports.options = async (req, res, next) => {
    const data = await Role.find({}, 'name describe -_id')
    res.json({ code: "000000", data })
}

/**
 * @method index
 * @param { Object } req.body
 * @return { json }
 * @description admin
 */
exports.index = async (req, res, next) => {
    const sortOrder = req.body.sortOrder
    const sortField = req.body.sortField

    // 按表头排序
    let sortRole
    switch (sortField) {
        case "createdAt":
            sortRole = { createdAt: sortOrder }
            break
        case "updatedAt":
            sortRole = { updatedAt: sortOrder }
            break
        case "status":
            sortRole = { status: sortOrder }
            break

        default:
            break
    }

    const total = await Role.find().countDocuments()
    await Role
        .find()
        .sort(sortRole)
        .populate({
            path: 'userCount',
            options: {
                lean: true
            }
        })
        .lean()
        .exec((err, data) => {
            if (err) throw new Error(err)
            res.json({ code: "000000", data: { total, data } })
        })
}

/**
 * @method create
 * @param { Object } req.body
 * @return { json }
 * @description admin 
 */
exports.create = async (req, res, next) => {
    const role = await new Role(req.body).save()
    res.json({ code: "000000", data: role })
}

/**
 * @method read
 * @param { Object } req.body
 * @return { json }
 * @description admin
 */
exports.read = async (req, res, next) => {
    const role = await Role.findById(req.body._id)
    res.json({ code: '000000', data: role })
}

/**
 * @method update
 * @param { Object } req.body
 * @return { json }
 * @description admin
 */
exports.update = async (req, res, next) => {
    const role = await Role.findByIdAndUpdate(req.body._id, req.body, { new: true })
    res.json({ code: "000000", data: role })
}

/**
 * @method delete
 * @param { Object } req.body
 * @return { json }
 * @description admin
 */
exports.delete = async (req, res, next) => {
    const role = await Role.findByIdAndDelete(req.body._id)
    await role.remove()
    res.json({ code: "000000", data: role })
}