'use strict'

const Joi = require('@hapi/joi')
const mongoose = require('mongoose')
const Role = require('../role/role.model')

const submenuSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true
    },
    index: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true
    },
});

const menuSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true
    },
    index: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true
    },
    subs: [submenuSchema],
}, {
    versionKey: false
});

/**
 * 预保存钩：
 */
menuSchema.pre('save', async function (next) {
    const menu = this
    next()
})

/**
 * 预保存钩：
 */
menuSchema.pre('remove', async function (next) {
    const menu = this
    next()
})

/**
 * 验证：Joi验证
 */
function validateMenu(menu) {
    const schema = Joi.object({
        id: Joi.string(),
        title: Joi.string().required().min(4).max(6).error(new Error('菜单标题不合法!')),
        icon: Joi.string().required().error(new Error('菜单图标路径不合法!')),
        index: Joi.string().required().error(new Error('菜单路由不合法!')),
        role: Joi.string().required().error(new Error('身份不合法!')),
    });
    return schema.validate(menu);
}

const Menu = mongoose.model('Menu', menuSchema)

module.exports = { Menu, validateMenu }