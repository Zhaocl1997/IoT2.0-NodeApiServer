'use strict'

const Device = require('./device.model')
const Role = require('../role/role.model')
const { vField } = require('../../helper/validate')
const { index_params } = require('../../helper/public')

const device_index = (filter, skip, limit, sort) => {
    return new Promise((resolve, reject) => {
        Device
            .find(filter)
            .countDocuments()
            .exec((err, total) => {
                if (err) reject(err)
                Device
                    .find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .populate({
                        path: 'dataCount'
                    })
                    .populate({
                        path: 'createdBy',
                        select: 'name'
                    })
                    .lean()
                    .exec((err, data) => {
                        if (err) reject(err)
                        resolve({ total, data })
                    })
            })
    })
}

/**
 * @method options
 * @param { Object }
 * @returns { data }
 * @description public 
 */
exports.options = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id", "type"])

    const data = await Device.find({ createdBy: req.body._id, type: req.body.type }, 'name')
    res.json({ code: "000000", data: { data } })
}

/**
 * @method index
 * @param { Object } 
 * @returns { data }
 * @description public 
 */
exports.index = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["sortOrder", "sortField", "pagenum", "pagerow", "filters"])

    const base = index_params(req.body)

    // 查询
    const filter = {
        adminFilter: {
            $or: [
                { name: { $regex: base.reg } },
                { macAddress: { $regex: base.reg } }
            ]
        },
        userFilter: {
            $and: [{ createdBy: req.user._id }],
            $or: [
                { name: { $regex: base.reg } },
                { macAddress: { $regex: base.reg } }
            ]
        }
    }

    const role = await Role.findById(req.user.role)

    if (role.name === 'admin') {
        const result = await device_index(filter.adminFilter, base.skip, base.limit, base.sort)
        res.json({ code: "000000", data: result })
    } else {
        const result = await device_index(filter.userFilter, base.skip, base.limit, base.sort)
        res.json({ code: "000000", data: result })
    }
}

/**
 * @method create
 * @param { Object }
 * @returns { Boolean }
 * @description public 
 */
exports.create = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["name", "macAddress", "type"])

    // 根据mac/name查找设备 解决mac/name唯一问题
    await Device.isExist(req.body)

    await Device.create({
        ...req.body,
        createdBy: req.user._id
    })
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method read
 * @param { Object }
 * @returns { data }
 * @description public
 */
exports.read = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    const device = await Device.findOne({ $and: [{ _id: req.body._id, createdBy: req.user._id }] })
    if (!device) throw new Error('设备不存在')
    res.json({ code: '000000', data: { data: device } })
}

/**
 * @method update
 * @param { Object } 
 * @returns { Boolean }
 * @description public 
 */
exports.update = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id", "name", "macAddress", "type"])

    // 根据mac/name查找设备 解决mac/name唯一问题
    await Device.isExist(req.body)

    const device = await Device.findOneAndUpdate({
        _id: req.body._id,
        createdBy: req.user._id
    }, req.body, { new: true })
    if (!device) throw new Error('设备不存在')
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method updateStatus
 * @param { Object } 
 * @returns { Boolean }
 * @description public 
 */
exports.updateStatus = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id", "status"])

    const device = await Device.findOne({
        _id: req.body._id,
        createdBy: req.user._id
    })
    if (!device) throw new Error('更新状态失败')
    device.status = req.body.status
    await device.save() // 必须触发这个钩子
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method delete
 * @param { Object }
 * @returns { Boolean }
 * @description public
 */
exports.delete = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    const device = await Device.findOne({
        _id: req.body._id,
        createdBy: req.user._id
    })
    if (!device) throw new Error('设备不存在')
    await device.remove()
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method deleteMany
 * @param { Object }
 * @returns { Boolean }
 * @description public
 */
exports.deleteMany = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["_id"])

    const devices = await Device.find({ _id: { $in: req.body._id } })
    if (devices.length !== req.body._id.length) throw new Error('删除失败')
    
    for (let i = 0; i < devices.length; i++) {
        const device = devices[i];
        await device.remove() // 触发钩子逻辑删除连带数据
    }
    res.json({ code: "000000", data: { data: true } })
}