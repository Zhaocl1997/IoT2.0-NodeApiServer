'use strict'

const path = require('path');
const svgCaptcha = require('svg-captcha');
const { validateId } = require('../../helper/public')
const { User, validateUser } = require('./user.model')
const { svgOptions } = require('../../helper/config')

/**
 * @method register
 * @param { Object } req.body
 * @return { json }
 * @description 注册 || public 
 */
exports.register = async (req, res, next) => {
    const { error } = validateUser(req.body);
    if (error) { return next(error) }

    // 根据email或phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    const user = new User(req.body)
    await user.save()
    res.json({ code: "000000", data: user })
}

/**
 * @method login
 * @param { Object } req.body
 * @return { json }
 * @description 登录 || public 
 */
exports.login = async (req, res, next) => {
    // 验证验证码
    if (req.session.randomcode !== req.body.verifyCode) { throw new Error('验证码错误') }

    const { error } = validateUser(req.body.email, req.body.phone, req.body.password);
    if (error) { return next(error) }

    // 通过email/phone查找用户并生成令牌
    const user = await User.findByCredentials(req.body)
    const token = await user.generateAuthToken()
    res.json({ code: "000000", data: { token, user } })
}

/**
 * @method logout
 * @param { null } 
 * @return { null }
 * @description 登出 || public
 */
exports.logout = async (req, res, next) => {
    res.json({ code: '000000' })
}

/**
 * @method captcha
 * @param { null }
 * @return { json }
 * @description 获取验证码 || public 
 */
exports.captcha = async (req, res, next) => {
    // 验证码，有两个属性，text是字符，data是svg代码
    svgCaptcha.loadFont(path.join(__dirname, process.env.SVG_DIR))
    const svgCode = svgCaptcha.create(svgOptions);
    // 保存到session,忽略大小写'eueh' 
    req.session.randomcode = svgCode.text.toLowerCase()
    res.json({ code: "000000", data: { img: svgCode.data } })
}

/**
 * @method index
 * @param { Object } req.body
 * @return { json }
 * @description 获取所有用户信息 || admin
 */
exports.index = async (req, res, next) => {
    const sortOrder = req.body.sortOrder
    const filters = req.body.filters
    const reg = new RegExp(filters, 'i')

    // 按表头排序
    let sortUsers
    switch (req.body.sortField) {
        case "name":
            sortUsers = { name: sortOrder }
            break;
        case "role":
            sortUsers = { role: sortOrder }
            break;
        case "createdAt":
            sortUsers = { createdAt: sortOrder }
            break;
        case "updatedAt":
            sortUsers = { updatedAt: sortOrder }
            break;
        case "status":
            sortUsers = { status: sortOrder }
            break;
        default:
            break;
    }

    const total = await User
        .find({
            $or: [
                { name: { $regex: reg } },
                { email: { $regex: reg } },
                { phone: { $regex: reg } },
            ]
        })
        .countDocuments()

    const data = await User
        .find({
            $or: [
                { name: { $regex: reg } },
                { email: { $regex: reg } },
                { phone: { $regex: reg } },
            ]
        })
        .skip(parseInt((req.body.pagenum - 1) * req.body.pagerow))
        .limit(parseInt(req.body.pagerow))
        .sort(sortUsers);

    res.json({ code: "000000", data: { total, data } })
}

/**
 * @method create
 * @param { Object } req.body
 * @return { json }
 * @description 创建新用户 || admin 
 */
exports.create = async (req, res, next) => {
    const { error } = validateUser(req.body);
    if (error) { return next(error) }

    // 根据email或phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    const user = new User(req.body)
    await user.save()
    res.json({ code: "000000", data: user })
}

/**
 * @method read
 * @param { Object } req.body
 * @return { json }
 * @description 获取指定用户信息 || admin
 */
exports.read = async (req, res, next) => {
    const { error } = validateId(req.body.id);
    if (error) { return next(error) }

    const user = await User.findById(req.body.id)
    if (!user) { throw new Error('用户不存在') }
    res.json({ code: '000000', data: user })
}

/**
 * @method update
 * @param { Object } req.body
 * @return { json }
 * @description 更新用户 || admin 
 */
exports.update = async (req, res, next) => {
    const { IdError } = validateId(req.body.id);
    if (IdError) { return next(error) }
    const { error } = validateUser(req.body);
    if (error) { return next(error) }

    // 根据email或phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    const user = await User.findByIdAndUpdate(req.body.id, req.body, { new: true })
    await user.save()
    res.json({ code: "000000", data: user })
}

/**
 * @method delete
 * @param { Object } req.body
 * @return { json }
 * @description 删除指定用户 || admin
 */
exports.delete = async (req, res, next) => {
    const { error } = validateId(req.body.id);
    if (error) { return next(error) }

    const user = await User.findByIdAndDelete(req.body.id)
    if (!user) { throw new Error('用户不存在') }
    await user.remove()
    res.json({ code: '000000', data: user })
}