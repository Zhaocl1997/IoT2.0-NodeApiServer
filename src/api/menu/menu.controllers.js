'use strict'

const mongoose = require('mongoose')

const Menu = require('./menu.model')
const Role = require('../role/role.model')
const { vField } = require('../../helper/validate')

/**
 * @method options
 * @param { Object }
 * @return { data } 
 * @description admin
 */
exports.options = async (req, res, next) => {
    const menu = await Menu.find()
    res.json({ code: "000000", data: { data: menu } })
}

/**
 * @method index
 * @param { Object } 
 * @returns { data } 
 * @description public
 */
exports.index = async (req, res, next) => {
    // 根据角色获取菜单ID
    const result = await Role.findById(req.user.role, 'menu -_id')
    const power = result.menu

    // 将ID从字符串变成ObJectID
    let id = []
    for (let i = 0; i < power.length; i++) {
        const element = power[i];
        id.push(mongoose.Types.ObjectId(element))
    }

    // 聚合查询
    Menu.aggregate([
        { '$unwind': '$subs' },
        { '$match': { 'subs._id': { '$in': id } } },
        {
            '$group': {
                '_id': '$_id',
                'title': { '$first': '$title' },
                'icon': { '$first': '$icon' },
                'index': { '$first': '$index' },
                'subs': { '$push': '$subs' }
            }
        },
        { '$sort': { '_id': 1, } },
    ]).exec((err, menu) => {
        if (err) throw new Error(err)
        res.json({ code: "000000", data: menu })
    })
}

/**
 * @method create
 * @param { Object }
 * @returns { Boolean }
 * @description admin 
 */
exports.create = async (req, res, next) => {
    if (!req.body._id) {
        // 验证字段
        vField(req.body, ["title", "icon", "index"])

        await Menu.create(req.body)
        res.json({ code: "000000", data: { data: true } })
    } else {
        // 验证字段
        vField(req.body, ["title", "icon", "index", "_id"])

        const hasSubMenu = await Menu.findById(req.body._id)
        delete req.body._id
        hasSubMenu.subs.push(req.body)
        await hasSubMenu.save()
        res.json({ code: "000000", data: { data: true } })
    }
}

/**
 * @method read
 * @param { Object }
 * @returns { data }
 * @description admin
 */
exports.read = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    const menu = await Menu.findById(req.body._id)
    if (!menu) throw new Error('菜单不存在')
    res.json({ code: "000000", data: { data: menu } })
}

/**
 * @method update
 * @param { Object }
 * @returns { Boolean }
 * @description admin 
 */
exports.update = async (req, res, next) => {
    if (req.body.subs) {
        // 验证字段
        vField(req.body, ["title", "icon", "index", "_id", "subs"])

        const menu = await Menu.findByIdAndUpdate(req.body._id, req.body, { new: true })
        if (!menu) throw new Error('菜单不存在')
        res.json({ code: "000000", data: { data: { data: true } } })
    } else {
        // 验证字段
        vField(req.body, ["title", "icon", "index", "_id"])

        await Menu.findOne({ "subs._id": req.body._id }, async (err, menu) => {
            if (err) throw new Error(err)

            const updates = Object.keys(req.body).filter(key => key !== '_id')
            const menuTwo = menu.subs.id(req.body._id)
            updates.forEach((update) => menuTwo[update] = req.body[update])
            await menu.save()
            res.json({ code: "000000", data: { data: true } })
        })
    }
}

/**
 * @method delete
 * @param { Object } 
 * @returns { Boolean }
 * @description admin
 */
exports.delete = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    // 删除菜单时同时删除角色表里menu数组里的相应ID
    // 仅限于删除二级菜单的ID
    const role = await Role.find()

    for (let i = 0; i < role.length; i++) {
        const element = role[i];

        for (let j = 0; j < element.menu.length; j++) {
            const menuID = element.menu[j];

            if (req.body._id.toString() === menuID.toString()) {
                element.menu.splice(j, 1)
                await element.save()
            }
        }
    }

    const menu = await Menu.findById(req.body._id)    
    if (menu) {
        await menu.remove()
        res.json({ code: "000000", data: { data: true } })
    } else {
        const menu = await Menu.findOne({ "subs._id": req.body._id })
        menu.subs.id(req.body._id).remove() // 不触发remove的钩子
        await menu.save()
        res.json({ code: "000000", data: { data: true } })
    }
}