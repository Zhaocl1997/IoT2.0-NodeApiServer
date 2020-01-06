'use strict'

const User = require('../user.model')
const { vField } = require('../../../helper/validate')
const sendValidateEmail = require('../../../utils/email')
const sendValidatePhone = require('../../../utils/phone')

/**
 * @method checkExist
 * @param { Object } 
 * @returns { null }
 * @description public 根据邮箱或手机查找用户
 */
exports.checkExist = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["type", "info", "captcha"])

    if (req.body.captcha !== req.session.captcha) throw new Error('验证码错误')

    let params
    switch (req.body.type) {
        case 'email':
            params = { email: req.body.info }
            break;

        case 'phone':
            params = { phone: req.body.info }
            break;

        default:
            break;
    }
    await User.findAndCheck(params)
    res.json({ code: "000000" })
}

/**
 * @method sendCode
 * @param { object } 
 * @returns { code }
 * @description public 发送手机/邮箱验证码
 */
exports.sendCode = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["type", "info"])

    // 生成6位随机验证码
    const code = parseInt(Math.random() * (999999 - 100000 + 1) + 100000, 10)

    switch (req.body.type) {
        case 'email': {
            // 发送验证码邮件
            const hasSendEmail = await sendValidateEmail(req.body.info, code)
            if (!hasSendEmail) throw new Error('验证码发送失败')
        } break;

        case 'phone': {
            // 发送验证码短信
            const hasSendText = await sendValidatePhone(req.body.info, code)
            if (!hasSendText) throw new Error('验证码发送失败')
        } break;

        default:
            break;
    }

    // 存到session
    req.session.code = code

    res.json({ code: "000000" })
}

/**
 * @method checkCode
 * @param { object } 
 * @returns { null }
 * @description public 验证手机/邮箱验证码
 */
exports.checkCode = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["type", "info"])

    if (req.body.info !== JSON.stringify(req.session.code)) throw new Error('验证码错误！')
    res.json({ code: "000000" })
}

/**
 * @method resetPass
 * @param { object } 
 * @returns { null }
 * @description public 重置密码
 */
exports.resetPass = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["type", "info"])

    let params
    switch (req.body.type) {
        case 'email':
            params = { email: req.body.info.email }
            break;

        case 'phone':
            params = { phone: req.body.info.phone }
            break;

        default:
            break;
    }
    const user = await User.findAndCheck(params)
    user.password = req.body.info.newPass
    await user.save()
    res.json({ code: "000000" })
}