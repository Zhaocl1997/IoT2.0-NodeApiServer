'use strict'

const fs = require('fs')
const zlib = require('zlib')
const User = require('./user.model')
const Role = require('../role/role.model')

const { vField } = require('../../helper/validate')
const { svgOptions, svgPath, avatarPath } = require('../../helper/config')

const sharp = require('sharp')
const rp = require('request-promise')
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

    const user = new User({
        ...req.body,
        role: role._id
    })
    await user.save()
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method login
 * @param { Object } 
 * @returns { data }
 * @description public 
 */
exports.login = async (req, res, next) => {
    // 验证字段
    if (req.body.phone) {
        vField(req.body, ["password", "phone", "verifyCode"])
    } else if (req.body.email) {
        vField(req.body, ["password", "email", "verifyCode"])
    }

    // 生成token
    const token = await req.user.generateAuthToken()

    await req.user.populate({ path: 'role', select: 'name' }).execPopulate()
    res.json({ code: "000000", data: { token, user: req.user } })
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
exports.weather = (req, res, next) => {
    // 验证字段
    vField(req.body, ["IP"])

    const IP = req.body.IP
    const ipURL = `http://api.map.baidu.com/location/ip?ak=F454f8a5efe5e577997931cc01de3974&ip=${IP}`
    rp({ uri: ipURL, json: true })
        .then(response => {
            const city = response.content.address_detail.city
            const weatherURL = encodeURI(`http://wthrcdn.etouch.cn/weather_mini?city=${city}`)
            rp({ uri: weatherURL, json: true, encoding: null })
                .then(result => {
                    zlib.unzip(result, (err, buffer) => {
                        if (err) console.log(err)
                        let data = JSON.parse(buffer.toString())

                        if (data.status == 1002) {
                            console.log(data.desc);
                            res.json({ code: "999999", message: data.desc })
                            return;
                        }
                        let result = data.data
                        res.json({ code: "000000", data: { data: result } });
                    });
                })
        })
        .catch((err) => {
            console.log(err.statusCode)
        });
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
exports.index = (req, res, next) => {
    // 验证字段
    vField(req.body, ["sortOrder", "sortField", "pagenum", "pagerow", "filters"])

    const sortOrder = req.body.sortOrder
    const sortField = req.body.sortField
    const pagenum = req.body.pagenum
    const pagerow = req.body.pagerow
    const filters = req.body.filters
    const reg = new RegExp(filters, 'i')

    // 排序
    let sort
    switch (sortField) {
        case "createdAt":
            sort = { createdAt: sortOrder }
            break
        case "updatedAt":
            sort = { updatedAt: sortOrder }
            break
        case "status":
            sort = { status: sortOrder }
            break

        default:
            break
    }

    // 分页
    const page = {
        skip: parseInt((pagenum - 1) * pagerow),
        limit: parseInt(pagerow)
    }

    // 查询
    const filter = {
        $or: [
            { name: { $regex: reg } },
            { email: { $regex: reg } },
            { phone: { $regex: reg } },
        ]
    }

    User
        .find(filter)
        .countDocuments()
        .exec((err, total) => {
            if (err) throw new Error(err)
            User
                .find(filter)
                .skip(page.skip)
                .limit(page.limit)
                .sort(sort)
                .populate({
                    path: 'devCount'
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
        })
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

    // 通过角色名称找到角色
    const role = await Role.findOne({ name: req.body.role })
    req.body.role = role._id

    const user = new User(req.body)
    await user.save()
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method read
 * @param { Object } 
 * @returns { data }
 * @description user
 */
exports.read = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    await req.user.populate({ path: 'role', select: 'name' }).execPopulate()
    res.json({ code: '000000', data: { data: req.user } })
}

/**
 * @method update
 * @param { Object } 
 * @returns { Boolean }
 * @description user 
 */
exports.update = async (req, res, next) => {
    // 验证字段
    if (req.body.gender) {
        vField(req.body, ["_id", "name", "email", "phone", "role", "birth", "gender", "area", "status", "avatar"])
    } else {
        vField(req.body, ["_id", "name", "email", "phone", "role"])
    }

    // 根据email/phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    // 通过角色名称找到角色
    const role = await Role.findOne({ name: req.body.role })
    req.body.role = role._id

    const user = await User.findByIdAndUpdate(req.body._id, req.body, { new: true })
    if (!user) throw new Error('用户不存在')
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

    const user = await User.findByIdAndDelete(req.body._id)
    if (!user) throw new Error('用户不存在')
    await user.remove()
    res.json({ code: '000000', data: { data: true } })
}