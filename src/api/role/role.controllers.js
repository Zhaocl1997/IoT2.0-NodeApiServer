'use strict'

const Role = require('./role.model')
const { validateId } = require('../../helper/public')


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
    const total = await Role.find().countDocuments()
    const data = await Role.find()
    for (const role of data) {
        await role.populate('users').execPopulate()
        await role.populate('menus').execPopulate()
        role.user = role.users.length
        role.menu = role.menus
    }
    res.json({ code: "000000", data: { total, data } })
}

/**
 * @method create
 * @param { Object } req.body
 * @return { json }
 * @description admin 
 */
exports.create = async (req, res, next) => {
    const role = await new Role({ ...req.body }).save()
    res.json({ code: "000000", data: role })
}

/**
 * @method read
 * @param { Object } req.body
 * @return { json }
 * @description admin
 */
exports.read = async (req, res, next) => {
    const { error } = validateId(req.body.id);
    if (error) { return next(error) }

    const role = await Role.findById(req.body.id)
    if (!role) { throw new Error('角色不存在') }
    res.json({ code: '000000', data: role })
}

/**
 * @method update
 * @param { Object } req.body
 * @return { json }
 * @description admin
 */
exports.update = async (req, res, next) => {
    const updates = Object.keys(req.body).filter(key => key !== 'id')
    const allowedUpdates = ['name', 'permission', 'status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) { throw new Error('更新字段不合法') }

    // 结果
    const role = await Role.findOne({ _id: req.body.id })
    if (!role) { throw new Error('角色不存在') }
    updates.forEach((update) => role[update] = req.body[update])
    await role.save()

    // 返回
    res.json({ code: "000000", data: role })
}

/**
 * @method delete
 * @param { Object } req.body
 * @return { json }
 * @description admin
 */
exports.delete = async (req, res, next) => {
    const { error } = validateId(req.body.id);
    if (error) { return next(error) }

    const role = await Role.findByIdAndDelete(req.body.id)
    await role.remove()
    res.json({ code: "000000", data: role })
}