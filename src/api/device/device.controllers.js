'use strict'

const Device = require('./device.model')
const User = require('../user/user.model')

/**
 * @method index
 * @param { Object } req.body
 * @return { json }
 * @description 根据ID获取该用户的所有设备信息 || public 
 */
exports.index = async (req, res, next) => {
    const sortOrder = req.body.sortOrder || -1
    const sortField = req.body.sortField || "status"
    const filters = req.body.filters
    const reg = new RegExp(filters, 'i')

    let sortDevices
    switch (sortField) {
        case "createdBy":
            sortDevices = { createdBy: sortOrder }
            break;
        case "createdAt":
            sortDevices = { createdAt: sortOrder }
            break;
        case "updatedAt":
            sortDevices = { updatedAt: sortOrder }
            break;
        case "status":
            sortDevices = { status: sortOrder }
            break;

        default:
            break;
    }

    let total
    if (req.user.role === 'admin') {
        total = await Device.find({
            $or: [
                { name: { $regex: reg } },
                { macAddress: { $regex: reg } }
            ]
        }).countDocuments()
    } else {
        await User
            .findOne({ _id: req.user._id })
            .populate({
                path: 'devices',
                match: [
                    { name: { $regex: reg } },
                    { macAddress: { $regex: reg } }
                ],
            })
            .exec((err, user) => {
                if (err) throw new Error(err)
                total = user.devices.length
            })
    }

    let data
    if (req.user.role === 'admin') {
        data = await Device.find({
            $or: [
                { name: { $regex: reg } },
                { macAddress: { $regex: reg } }
            ]
        })
            .limit(parseInt(req.body.pagerow))
            .skip(parseInt((req.body.pagenum - 1) * req.body.pagerow))
            .sort(sortDevices)
        if (total && data) {
            res.json({ code: "000000", data: { total, data } })
        }
    } else {
        await User
            .findOne({ _id: req.user._id })
            .populate({
                path: 'devices',
                match: [
                    { name: { $regex: reg } },
                    { macAddress: { $regex: reg } }
                ],
                options: {
                    limit: parseInt(req.body.pagerow),
                    skip: parseInt((req.body.pagenum - 1) * req.body.pagerow),
                    sort: sortDevices
                }
            })
            .exec((err, user) => {
                if (err) throw new Error(err)
                data = user.devices
                if (total && data) {
                    res.json({ code: "000000", data: { total, data } })
                }
            })
    }
}

/**
 * @method create
 * @param { Object } req.body
 * @return { json }
 * @description 为指定用户创建新设备 || public 
 */
exports.create = async (req, res, next) => {
    // 根据macAddress查找用户 解决macAddress唯一问题
    await Device.isExist(req.body.macAddress)

    const device = new Device({
        ...req.body,
        createdBy: req.user._id
    })
    await device.save()
    res.json({ code: "000000", data: device })
}

/**
 * @method read
 * @param { Object } req.body
 * @return { json }
 * @description 读取指定用户的指定设备信息 || public
 */
exports.read = async (req, res, next) => {
    const device = await Device.findOne({ $and: [{ _id: req.body.id, createdBy: req.user._id }] })
    if (!device) { throw new Error('设备不存在') }
    res.json({ code: '000000', data: device })
}

/**
 * @method update
 * @param { Object } req.body
 * @return { json }
 * @description 更新指定用户的指定设备信息 || public 
 */
exports.update = async (req, res, next) => {
    // 根据macAddress查找用户 解决macAddress唯一问题
    const oldDevice = await Device.findOne({ $and: [{ _id: { $ne: req.body.id }, macAddress: req.body.macAddress }] })
    if (oldDevice) { throw new Error('设备已存在') }

    const device = await Device.findByIdAndUpdate(req.body.id, req.body, { new: true })
    await device.save()
    res.json({ code: "000000", data: device })
}

/**
 * @method delete
 * @param { Object } req.body
 * @return { json }
 * @description 删除指定用户的指定设备信息 || public
 */
exports.delete = async (req, res, next) => {
    const device = await Device.findOneAndDelete({ $and: [{ _id: req.body.id, createdBy: req.user._id }] })
    if (!device) { throw new Error('设备不存在') }
    res.json({ code: "000000", data: device })
}