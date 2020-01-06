'use strict'

const sharp = require('sharp')
const bcrypt = require('bcryptjs')

const User = require('../user.model')
const { vField } = require('../../../helper/validate')
const getWather = require('../../../utils/weather')
const { avatarPath } = require('../../../helper/config')

/**
 * @method logout
 * @param { null } 
 * @returns { Boolean }
 * @description user
 */
exports.logout = async (req, res, next) => {
    res.json({ code: '000000', data: { data: true } })
}

/**
 * @method read
 * @param { Object } 
 * @returns { data }
 * @description user
 */
exports.read = async (req, res, next) => {
    await req.user.populate({ path: 'role', select: 'name' }).execPopulate()
    res.json({ code: '000000', data: { data: req.user } })
}

/**
 * @method avatar
 * @param { form-data }
 * @returns { Boolean }
 * @description user 
 */
exports.avatar = async (req, res, next) => {
    const avatarName = `${req.user._id}.png`
    const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()

    fs.writeFile(
        avatarPath + avatarName,
        buffer,
        "binary",
        (err) => {
            if (err) throw err;
            req.user.avatar = process.env.SERVER_URL + '/avatar/' + avatarName
            req.user.save()
            res.json({ code: "000000", data: { data: true } })
        })
}

/**
 * @method weather
 * @param { IP }
 * @returns { data }
 * @description user 
 */
exports.weather = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["IP"])

    const IP = req.body.IP
    const result = await getWather(IP)
    res.json({ code: "000000", data: { data: result } });
}

/**
 * @method updateInfo
 * @param { Object } 
 * @returns { Boolean }
 * @description user 
 */
exports.updateInfo = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id", "name", "email", "phone", "birth", "gender", "area"])

    // 根据email/phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    const user = await User.findByIdAndUpdate(req.body._id, req.body, { new: true })
    if (!user) throw new Error('用户不存在')
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method changePass
 * @param { Object } 
 * @returns { Boolean }
 * @description user 
 */
exports.changePass = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["oldPass", "newPass"])

    const oldPass = req.body.oldPass
    const newPass = req.body.newPass

    if (oldPass === newPass) throw new Error('新密码不可以和原密码一致！')

    const isMatch = await bcrypt.compare(oldPass, req.user.password)
    if (!isMatch) throw new Error('密码错误！')

    req.user.password = newPass
    await req.user.save()
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method unlock
 * @param { Object } 
 * @returns { Boolean }
 * @description user 
 */
exports.unlock = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["pass"])

    const isMatch = await bcrypt.compare(req.body.pass, req.user.password)
    if (!isMatch) throw new Error('密码错误')

    res.json({ code: "000000", data: { data: true } })
}
