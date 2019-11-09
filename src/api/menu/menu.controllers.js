'use strict'

const Menu = require('./menu.model')
const Role = require('../role/role.model')

/**
 * @method index
 * @param { Object } req.body
 * @return { json } 
 * @description 根据用户角色查询相应菜单 || public
 */
exports.index = async (req, res, next) => {
    let data = []

    if (req.user.role === 'admin') {
        data = await Menu.find()
    } else {
        const result = await Role.findOne({ name: req.user.role }, 'menu -_id')
        for (let i = 0; i < result.menu.length; i++) {
            const menuOneId = result.menu[i];
            const menuOne = await Menu.findById(menuOneId)
            if (menuOne) {
                menuOne.subs.filter(menuTwo => {
                    menuTwo._id !== result.menu
                })
                data.push(menuOne)
            }
        }
    }
    res.json({ code: "000000", data: data })
}

/**
 * @method create
 * @param { Object } req.body
 * @return { json }
 * @description 新建菜单 || admin 
 */
exports.create = async (req, res, next) => {
    let menu
    if (!req.body.id) {
        menu = await new Menu(req.body).save()
    } else {
        const subMenu = await Menu.findById(req.body.id)
        delete req.body.id
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
    const menu = await Menu.findById(req.body.id)
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
    const menu = await Menu.findById(req.body.id)
    if (menu) {
        const menuOne = await Menu.findByIdAndUpdate(req.body.id, req.body, { new: true })
        result = await menuOne.save()
    } else {
        await Menu.findOne({ "subs._id": req.body.id }, (err, menu) => {
            if (err) { throw new Error(err) }

            const updates = Object.keys(req.body).filter(key => key !== 'id')
            const menuTwo = menu.subs.id(req.body.id)
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
    const menu = await Menu.findById(req.body.id)
    if (menu) {
        result = await menu.remove()
    } else {
        await Menu.findOne({ "subs._id": req.body.id }, async (err, menu) => {
            if (err) { throw new Error(err) }
            menu.subs.id(req.body.id).remove() // 不触发remove的钩子
            result = await menu.save()
        })
    }

    res.json({ code: "000000", data: result })
}