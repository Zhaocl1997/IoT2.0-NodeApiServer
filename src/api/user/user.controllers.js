'use strict'

const fs = require('fs')
const User = require('./user.model')
const Role = require('../role/role.model')

const { vField } = require('../../helper/validate')
const { index_params } = require('../../helper/public')
const { svgOptions, svgPath, avatarPath } = require('../../helper/config')
const getWather = require('../../utils/weather')
const sendValidateEmail = require('../../utils/email')

const bcrypt = require('bcryptjs')
const sharp = require('sharp')
const svgCaptcha = require('svg-captcha')

/**
 * @method register
 * @param { Object } 
 * @returns { data }
 * @description public 
 */
exports.register = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["name", "password", "email", "phone"])

    // 根据email或phone查找用户 解决email/phone唯一问题
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
    if (req.body.phone && req.body.verifyCode) {
        vField(req.body, ["password", "phone", "verifyCode"])
    } else if (req.body.email && req.body.verifyCode) {
        vField(req.body, ["password", "email", "verifyCode"])
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
 * @method genCode
 * @param { null } 
 * @returns { code }
 * @description public 
 */
exports.gencode = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["email"])

    // 生成6位随机验证码
    const code = parseInt(Math.random() * (999999 - 100000 + 1) + 100000, 10)

    // 发送验证码邮件
    const hasSendEmail = await sendValidateEmail(req.body.email, code)
    if (!hasSendEmail) throw new Error('验证码邮件发送失败')

    // 存到session
    req.session.code = code
    res.json({ code: "000000", data: { code } })
}

/**
 * @method findpass
 * @param { Object } 
 * @returns { boolean }
 * @description public 
 */
exports.findpass = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["email", "code", "newPass", "checkPass"])

    const email = req.body.email
    const code = req.body.code
    const newPass = req.body.newPass
    const checkPass = req.body.checkPass

    // 根据email查找用户
    const user = await User.findOne({ email })
    if (!user) throw new Error('用户不存在！')

    // 验证
    if (newPass !== checkPass) throw new Error('两次密码不一致！')
    if (code !== JSON.stringify(req.session.code)) throw new Error('验证码错误！')

    // 重置密码
    user.password = newPass
    await user.save()

    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method logout
 * @param { null } 
 * @returns { Boolean }
 * @description public
 */
exports.logout = async (req, res, next) => {
    res.json({ code: '000000', data: { data: true } })
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
    req.session.randomcode = svgCode.text.toLowerCase()
    res.json({ code: "000000", data: { img: svgCode.data } })
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
 * @method options
 * @param { Object }
 * @returns { data }
 * @description admin
 */
exports.options = async (req, res, next) => {
    const data = await User.find({}, 'name')
    res.json({ code: "000000", data: { data } });
}

/**
 * @method index
 * @param { Object } 
 * @returns { data }
 * @description admin
 */
exports.index = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["sortOrder", "sortField", "pagenum", "pagerow", "filters"])

    const base = index_params(req.body)

    // 查询
    const filter = {
        $or: [
            { name: { $regex: base.reg } },
            { email: { $regex: base.reg } },
            { phone: { $regex: base.reg } },
        ]
    }

    const total = await User.find(filter).countDocuments()
    const data = await User.find(filter)
        .skip(base.skip).limit(base.limit).sort(base.sort)
        .populate({ path: 'devCount' })
        .populate({ path: 'role', select: 'name' })
        .lean()

    res.json({ code: "000000", data: { total, data } })
}

/**
 * @method create
 * @param { Object }
 * @returns { Boolean }
 * @description admin 
 */
exports.create = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["name", "password", "email", "phone", "role"])

    // 根据email或phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    await User.create(req.body)
    res.json({ code: "000000", data: { data: true } })
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
 * @method update
 * @param { Object } 
 * @returns { Boolean }
 * @description admin 
 */
exports.update = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id", "name", "email", "phone", "role"])

    // 根据email/phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    const user = await User.findByIdAndUpdate(req.body._id, req.body, { new: true })
    if (!user) throw new Error('用户不存在')
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method updateStatus
 * @param { Object } 
 * @returns { Boolean }
 * @description admin 
 */
exports.updateStatus = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id", "status"])

    const user = await User.findById(req.body._id)
    if (!user) throw new Error('用户不存在')
    user.status = req.body.status
    await user.save()
    res.json({ code: "000000", data: { data: true } })
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
    vField(req.body, ["oldPass", "newPass", "conPass"])

    const oldPass = req.body.oldPass
    const newPass = req.body.newPass
    const conPass = req.body.conPass

    if (newPass !== conPass) throw new Error('两次输入密码不一致！')
    if (oldPass === newPass) throw new Error('新密码不可以和原密码一致！')

    const isMatch = await bcrypt.compare(oldPass, req.user.password)
    if (!isMatch) throw new Error('原密码错误！')

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

/**
 * @method delete
 * @param { Object } 
 * @returns { Boolean }
 * @description admin
 */
exports.delete = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    const user = await User.findById(req.body._id)
    if (!user) throw new Error('用户不存在')
    await user.remove()
    res.json({ code: '000000', data: { data: true } })
}

/**
 * @method deleteMany
 * @param { Object } 
 * @returns { Boolean }
 * @description admin
 */
exports.deleteMany = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    const users = await User.find({ _id: { $in: req.body._id } })
    if (users.length !== req.body._id.length) throw new Error('删除失败')

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        await user.remove() // 触发钩子逻辑删除连带设备
    }
    res.json({ code: '000000', data: { data: true } })
}