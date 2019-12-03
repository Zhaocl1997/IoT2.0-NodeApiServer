'use strict'

const Menu = require('./menu.model')
const Role = require('../role/role.model')
const { aggregate_merge } = require('../../helper/public')
const mongoose = require('mongoose')

exports.options = async (req, res, next) => {
    const menu = await Menu.find()
    res.json({ code: "000000", data: menu })
}

/**
 * @method index
 * @param { Object } req.body
 * @return { json } 
 * @description 根据用户角色查询相应菜单 || public
 */
exports.index = async (req, res, next) => {
    const result = await Role.findById(req.user.role, 'menu -_id')
    const power = result.menu

    // 滤去其中的一级菜单ID
    for (let k = power.length - 1; k > -1; k--) {
        const e = power[k];
        const menuOne = await Menu.findById(e)
        if (menuOne) {
            power.splice(k, 1)
        }
    }

    let arr = []
    for (let i = power.length - 1; i > -1; i--) {
        const id = power[i];

        Menu.aggregate([
            {
                $match: {
                    'subs._id': mongoose.Types.ObjectId(id)
                }
            },
            {
                $unwind: '$subs'
            },
            {
                $match: {
                    'subs._id': mongoose.Types.ObjectId(id)
                }
            }
        ]).exec((err, menu) => {
            if (err) throw new Error(err)
            arr.push(menu[0])

            if (arr.length === power.length) {
                const menu = aggregate_merge(arr)

                res.json({ code: "000000", data: menu })
            }
        })
    }
}

/**
 * @method create
 * @param { Object } req.body
 * @return { json }
 * @description 新建菜单 || admin 
 */
exports.create = async (req, res, next) => {
    let menu
    if (!req.body._id) {
        menu = await new Menu(req.body).save()
    } else {
        const subMenu = await Menu.findById(req.body._id)
        delete req.body._id
        subMenu.subs.push(req.body)
        menu = await subMenu.save()
    }
    res.json({ code: "000000", data: menu })
}

/**
 * @method read
 * @param { Object } req.body
 * @return { json }
 * @description 读取菜单信息 || admin
 */
exports.read = async (req, res, next) => {
    const menu = await Menu.findById(req.body._id)
    if (!menu) { throw new Error('菜单不存在') }
    res.json({ code: '000000', data: menu })
}

/**
 * @method update
 * @param { Object } req.body
 * @return { json }
 * @description 更新指定菜单 || admin 
 */
exports.update = async (req, res, next) => {
    let result
    const menu = await Menu.findById(req.body._id)
    if (menu) {
        result = await Menu.findByIdAndUpdate(req.body._id, req.body, { new: true })
    } else {
        await Menu.findOne({ "subs._id": req.body._id }, (err, menu) => {
            if (err) { throw new Error(err) }

            const updates = Object.keys(req.body).filter(key => key !== '_id')
            const menuTwo = menu.subs.id(req.body._id)
            updates.forEach((update) => menuTwo[update] = req.body[update])
            result = menu.save()
        })
    }

    res.json({ code: "000000", data: result })
}

/**
 * @method delete
 * @param { Object } req.body
 * @return { json }
 * @description 删除指定菜单信息 || admin
 */
exports.delete = async (req, res, next) => {
    let result
    const menu = await Menu.findById(req.body._id)
    if (menu) {
        result = await menu.remove()
    } else {
        await Menu.findOne({ "subs._id": req.body._id }, async (err, menu) => {
            if (err) { throw new Error(err) }
            menu.subs.id(req.body._id).remove() // 不触发remove的钩子
            result = await menu.save()
        })
    }

    res.json({ code: "000000", data: result })
}