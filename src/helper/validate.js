'use strict'

const Joi = require('@hapi/joi')

/**
 * 验证：Joi验证User
 */
function vUser(user) {
    const schema = Joi.object({
        _id: Joi.string().trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('用户ID字段格式错误')),
        name: Joi.string().trim().lowercase().min(3).max(12).error(new Error('用户名称字段格式错误')),
        email: Joi.string().trim().lowercase().email().pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/).error(new Error('用户邮箱字段格式错误')),
        phone: Joi.string().trim().lowercase().pattern(/^[1][2-9][0-9]{9}$/).error(new Error('用户手机字段格式错误')),
        password: Joi.string().trim().min(9).max(16).error(new Error('用户密码字段格式错误')),
        role: Joi.string().trim().lowercase().error(new Error('用户角色字段格式错误')),
        gender: Joi.string().trim().lowercase().error(new Error('用户性别字段格式错误')),
        birth: Joi.object({
            year: Joi.number().positive().integer().min(1970).max(2019).error(new Error('用户生日字段格式错误')),
            month: Joi.number().positive().integer().min(1).max(12).error(new Error('用户生日字段格式错误')),
            day: Joi.number().positive().integer().min(1).max(31).error(new Error('用户生日字段格式错误')),
        }),
        area: Joi.array().length(3).items(Joi.string()).error(new Error('用户地址字段格式错误')),
        avatar: Joi.string().trim().lowercase().error(new Error('用户头像字段格式错误')),
        status: Joi.boolean().error(new Error('用户状态字段格式错误')),
        verifyCode: Joi.string().trim().lowercase().error(new Error('验证码字段格式错误')),
    });
    return schema.validate(user);
}

/**
 * 验证：Joi验证Device
 */
function vDev(device) {
    const schema = Joi.object({
        _id: Joi.string().trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('设备ID字段格式错误')),
        name: Joi.string().trim().lowercase().alphanum().min(3).max(8).error(new Error('设备名称字段格式错误')),
        macAddress: Joi.string().trim().pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/).error(new Error('设备mac字段格式错误')),
        type: Joi.string().trim().lowercase().error(new Error('设备类型字段格式错误')),
        status: Joi.boolean().error(new Error('设备状态字段格式错误'))
    });
    return schema.validate(device);
}

/**
 * 验证：Joi验证Data
 */
function vData(macAddress) {
    const schema = Joi.string().trim().pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/).error(new Error('设备mac字段格式错误!'))
    return schema.validate(macAddress);
}

/**
 * 验证：Joi验证Menu
 */
function vMenu(menu) {
    const schema = Joi.object({
        _id: Joi.string().trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('菜单ID字段格式错误')),
        title: Joi.string().trim().lowercase().min(4).max(10).error(new Error('菜单标题字段格式错误')),
        icon: Joi.string().trim().lowercase().error(new Error('菜单图标字段格式错误')),
        index: Joi.string().trim().lowercase().error(new Error('菜单路由字段格式错误')),
        subs: Joi.array()
    });
    return schema.validate(menu);
}

/**
 * 验证：Joi验证Role
 */
function vRole(role) {
    const schema = Joi.object({
        _id: Joi.string().trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('角色ID字段格式错误')),
        name: Joi.string().trim().lowercase().min(4).max(10).error(new Error('角色名称字段格式错误')),
        describe: Joi.string().trim().lowercase().min(2).max(8).error(new Error('角色描述字段格式错误')),
        menu: Joi.array().error(new Error('角色权限字段格式错误')),
        status: Joi.boolean().error(new Error('角色状态字段格式错误'))
    });
    return schema.validate(role);
}

/**
 * 验证：Joi验证Route
 */
function vRoute(route) {
    const schema = Joi.object({
        _id: Joi.string().trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('路由ID字段格式错误')),
        path: Joi.string().trim().lowercase().error(new Error('路由路径字段格式错误')),
        name: Joi.string().trim().lowercase().error(new Error('路由名称字段格式错误')),
        meta: Joi.object().error(new Error('路由数据字段格式错误')),
        component: Joi.string().trim().lowercase().error(new Error('路由组件字段格式错误')),
        package: Joi.string().trim().lowercase().error(new Error('路由打包名字段格式错误'))
    });
    return schema.validate(route);
}

/**
 * 验证：Joi验证ID
 */
function vId(id) {
    const schema = Joi.string().trim().lowercase().length(24).pattern(/^[0-9a-fA-F]{24}$/).error(new Error('ID字段格式错误'))
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