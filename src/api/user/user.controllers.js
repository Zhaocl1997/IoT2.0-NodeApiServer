'use strict'

const svgCaptcha = require('svg-captcha')
const User = require('./user.model')
const Role = require('../role/role.model')
const { svgOptions, svgPath, avatarPath } = require('../../helper/config')
const sharp = require('sharp')
const fs = require('fs')
const zlib = require('zlib')
const rp = require('request-promise');
const ObjectId = require('mongodb').ObjectId

/**
 * @method register
 * @param { Object } req.body
 * @return { json }
 * @description 注册 || public 
 */
exports.register = async (req, res, next) => {
    // 根据email或phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    const role = await Role.findOne({ name: 'user' })

    const user = new User({
        ...req.body,
        role: role._id
    })
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
    const token = await req.user.generateAuthToken()
    res.json({ code: "000000", data: { token, user: req.user } })
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
    svgCaptcha.loadFont(svgPath)
    const svgCode = svgCaptcha.create(svgOptions)
    // 保存到session,忽略大小写'eueh' 
    req.session.randomcode = svgCode.text.toLowerCase()
    res.json({ code: "000000", data: { img: svgCode.data } })
}

/**
 * @method avatar
 * @param { form-data }
 * @return { json }
 * @description 上传头像 || public 
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
            res.json({ code: "000000" })
        })
}

/**
 * @method weather
 * @param { city }
 * @return { json }
 * @description 获取天气 || public 
 */
exports.weather = (req, res, next) => {
    const IP = req.body.IP
    rp(`http://ip.taobao.com/service/getIpInfo.php?ip=${IP}`)
        .then(response => {
            const city = JSON.parse(response).data.city

            if (city === 'XX') {
                throw new Error('解析IP失败');
            }

            rp({ uri: encodeURI(`http://wthrcdn.etouch.cn/weather_mini?city=${city}`), json: true, encoding: null })
                .then(result => {
                    zlib.unzip(result, (err, buffer) => {
                        if (err) throw new Error(err);
                        let data = JSON.parse(buffer.toString())
                        if (data.status == 1002) {
                            console.log(data.desc);
                            res.json({ code: "999999", message: data.desc })
                            return;
                        }
                        let result = data.data.forecast[0]
                        res.json({ code: "000000", data: { today: result, city: data.data.city } });
                    });
                })
        })
        .catch((err) => {
            throw new Error(err);
        });
}

/**
 * @method options
 * @param { Object } req.body
 * @return { json }
 * @description 获取用户options || admin
 */
exports.options = async (req, res, next) => {
    const user = await User.find({}, 'name')
    res.json({ code: "000000", data: { user } });
}


/**
 * @method index
 * @param { Object } req.body
 * @return { json }
 * @description 获取所有用户信息 || admin
 */
exports.index = async (req, res, next) => {
    const sortOrder = req.body.sortOrder
    const sortField = req.body.sortField
    const pagenum = req.body.pagenum
    const pagerow = req.body.pagerow
    const filters = req.body.filters
    const reg = new RegExp(filters, 'i')

    // 按表头排序
    let sortUsers
    switch (sortField) {
        case "createdAt":
            sortUsers = { createdAt: sortOrder }
            break
        case "updatedAt":
            sortUsers = { updatedAt: sortOrder }
            break
        case "status":
            sortUsers = { status: sortOrder }
            break

        default:
            break
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

    await User
        .find({
            $or: [
                { name: { $regex: reg } },
                { email: { $regex: reg } },
                { phone: { $regex: reg } },
            ]
        })
        .skip(parseInt((pagenum - 1) * pagerow))
        .limit(parseInt(pagerow))
        .sort(sortUsers)
        .populate({
            path: 'devCount',
            options: {
                lean: true
            }
        })
        .populate({
            path: 'role',
            select: 'name'
        })
        .lean()
        .exec((err, data) => {
            if (err) throw new Error(err)
            res.json({ code: "000000", data: { total, data } })
        })
}

/**
 * @method create
 * @param { Object } req.body
 * @return { json }
 * @description 创建新用户 || admin 
 */
exports.create = async (req, res, next) => {
    // 根据email或phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    const role = await Role.findOne({ name: req.body.role })
    delete req.body.role

    const user = new User({
        ...req.body,
        role: role._id
    })
    await user.save()
    res.json({ code: "000000", data: user })
}

/**
 * @method read
 * @param { Object } req.body
 * @return { json }
 * @description 获取指定用户 || admin
 */
exports.read = async (req, res, next) => {
    await req.user.populate({ path: 'role', select: 'name' }).execPopulate()
    res.json({ code: '000000', data: req.user })
}

/**
 * @method update
 * @param { Object } req.body
 * @return { json }
 * @description 更新用户 || admin 
 */
exports.update = async (req, res, next) => {
    // 根据email/phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    if (req.body.role) {
        const role = await Role.findOne({ name: req.body.role })
        req.body.role = ObjectId(role._id)
    }

    const user = await User.findByIdAndUpdate(req.body._id, req.body, { new: true })
    if (!user) throw new Error('用户不存在')
    res.json({ code: "000000", data: user })
}

/**
 * @method delete
 * @param { Object } req.body
 * @return { json }
 * @description 删除指定用户 || admin
 */
exports.delete = async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.body._id)
    if (!user) throw new Error('用户不存在')
    await user.remove()
    res.json({ code: '000000', data: user })
}