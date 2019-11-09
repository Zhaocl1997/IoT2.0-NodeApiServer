'use strict'

const Joi = require('@hapi/joi')

/**
 * 验证：Joi验证User
 */
function vUser(user) {
    const schema = Joi.object({
        id: Joi.string().trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('用户ID不合法')),
        name: Joi.string().trim().lowercase().alphanum().min(6).max(12).error(new Error('用户名称不合法')),
        email: Joi.string().trim().lowercase().email().pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/).error(new Error('用户邮箱不合法')),
        phone: Joi.string().trim().lowercase().pattern(/^[1][2-9][0-9]{9}$/).error(new Error('用户手机不合法')),
        password: Joi.string().trim().min(9).max(16).error(new Error('用户密码不合法')),
        role: Joi.string().trim().lowercase().error(new Error('用户角色不合法')),
        status: Joi.boolean().error(new Error('用户状态不合法')),
        verifyCode: Joi.string().trim().lowercase().error(new Error('验证码不合法'))
    });
    return schema.validate(user);
}

/**
 * 验证：Joi验证Device
 */
function vDev(device) {
    const schema = Joi.object({
        id: Joi.string().trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('设备ID不合法')),
        name: Joi.string().trim().lowercase().alphanum().min(6).max(12).error(new Error('设备名称不合法')),
        macAddress: Joi.string().trim().pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/).error(new Error('设备mac不合法')),
        type: Joi.string().trim().lowercase().error(new Error('设备类型不合法')),
        status: Joi.boolean().error(new Error('设备状态不合法'))
    });
    return schema.validate(device);
}

/**
 * 验证：Joi验证Data
 */
function vData(macAddress) {
    const schema = Joi.string().trim().pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/).error(new Error('设备mac不合法!'))
    return schema.validate(macAddress);
}

/**
 * 验证：Joi验证Menu
 */
function vMenu(menu) {
    const schema = Joi.object({
        id: Joi.string().trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('菜单ID不合法')),
        title: Joi.string().trim().lowercase().required().min(4).max(10).error(new Error('菜单标题不合法')),
        icon: Joi.string().trim().lowercase().required().error(new Error('菜单图标不合法')),
        index: Joi.string().trim().lowercase().required().error(new Error('菜单路由不合法')),
        subs: Joi.array()
    });
    return schema.validate(menu);
}

/**
 * 验证：Joi验证Role
 */
function vRole(role) {
    const schema = Joi.object({
        id: Joi.string().trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('角色ID不合法')),
        name: Joi.string().trim().lowercase().required().min(4).max(10).error(new Error('角色名称不合法')),
        describe: Joi.string().trim().lowercase().required().min(2).max(8).error(new Error('角色描述不合法')),
        number: Joi.number().error(new Error('角色数量不合法')),
        menu: Joi.array().error(new Error('角色权限不合法')),
        status: Joi.boolean().error(new Error('角色状态不合法'))
    });
    return schema.validate(role);
}

/**
 * 验证：Joi验证Route
 */
function vRoute(route) {
    const schema = Joi.object({
        id: Joi.string().trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('路由ID不合法')),
        path: Joi.string().trim().lowercase().error(new Error('路由路径不合法')),
        name: Joi.string().trim().lowercase().error(new Error('路由名称不合法')),
        meta: Joi.object().error(new Error('路由数据不合法')),
        component: Joi.string().trim().lowercase().error(new Error('路由组件不合法')),
        package: Joi.string().trim().lowercase().error(new Error('路由包名不合法'))
    });
    return schema.validate(route);
}

/**
 * 验证：Joi验证ID
 */
function vId(id) {
    const schema = Joi.string().trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('ID不合法'))
    return schema.validate(id);
}

module.exports = {
    vUser,
    vDev,
    vData,
    vMenu,
    vRole,
    vRoute,
    vId
}