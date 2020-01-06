'use strict'

const svgCaptcha = require('svg-captcha')

const User = require('../user.model')
const Role = require('../../role/role.model')
const { vField } = require('../../../helper/validate')
const { svgOptions, svgPath } = require('../../../helper/config')

/**
 * @method register
 * @param { Object } 
 * @returns { data }
 * @description public 
 */
exports.register = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["name", "password", "email", "phone", "code"])

    if (req.body.code !== JSON.stringify(req.session.code)) throw new Error('验证码错误')

    // 根据phone查找用户 解决phone唯一问题
    await User.isExist(req.body)

    // 默认用户角色为user
    const role = await Role.findOne({ name: 'user' })
    const user = await User.create({
        ...req.body,
        role: role._id
    })
    res.json({ code: "000000", data: { data: user } })
}

/**
 * @method login
 * @param { Object } 
 * @returns { data }
 * @description public 
 */
exports.login = async (req, res, next) => {
    // 验证字段
    if (req.body.phone && req.body.captcha) {
        vField(req.body, ["password", "phone", "captcha"])
    } else if (req.body.email && req.body.captcha) {
        vField(req.body, ["password", "email", "captcha"])
    } else if (req.body.phone) {
        vField(req.body, ["password", "phone"])
    } else if (req.body.email) {
        vField(req.body, ["password", "email"])
    }

    // 生成token
    const token = await req.user.generateAuthToken()

    await req.user.populate({ path: 'role', select: 'name' }).execPopulate()
    res.json({ code: "000000", data: { token, user: req.user } })
}

/**
 * @method captcha
 * @param { session }
 * @returns { data }
 * @description public 
 */
exports.captcha = async (req, res, next) => {
    // 验证码，有两个属性，text是字符，data是svg代码
    svgCaptcha.loadFont(svgPath)
    const svgCode = svgCaptcha.create(svgOptions)
    // 保存到session,忽略大小写'eueh' 
    req.session.captcha = svgCode.text.toLowerCase()
    res.json({ code: "000000", data: { img: svgCode.data } })
}