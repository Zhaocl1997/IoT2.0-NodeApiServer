'use strict'

const Device = require('./device.model')
const Role = require('../role/role.model')
const { vField } = require('../../helper/validate')

function device_index(filter, page, sort) {
    return new Promise((resolve, reject) => {
        Device
            .find(filter)
            .countDocuments()
            .exec((err, total) => {
                if (err) reject(err)
                Device
                    .find(filter)
                    .skip(page.skip)
                    .limit(page.limit)
                    .sort(sort)
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

    const sortOrder = req.body.sortOrder
    const sortField = req.body.sortField
    const pagenum = req.body.pagenum
    const pagerow = req.body.pagerow
    const filters = req.body.filters
    const reg = new RegExp(filters, 'i')

    // 排序
    let sort
    switch (sortField) {
        case "type":
            sort = { type: sortOrder }
            break;
        case "createdBy":
            sort = { createdBy: sortOrder }
            break;
        case "createdAt":
            sort = { createdAt: sortOrder }
            break;
        case "updatedAt":
            sort = { updatedAt: sortOrder }
            break;
        case "status":
            sort = { status: sortOrder }
            break;

        default:
            break;
    }

    // 分页
    const page = {
        skip: parseInt((pagenum - 1) * pagerow),
        limit: parseInt(pagerow)
    }

    // 查询
    const filter = {
        adminFilter: {
            $or: [
                { name: { $regex: reg } },
                { macAddress: { $regex: reg } }
            ]
        },
        userFilter: {
            $and: [{ createdBy: req.user._id }],
            $or: [
                { name: { $regex: reg } },
                { macAddress: { $regex: reg } }
            ]
        }
    }

    const role = await Role.findById(req.user.role)

    if (role.name === 'admin') {
        device_index(filter.adminFilter, page, sort)
            .then(result => {
                res.json({ code: "000000", data: result })
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        device_index(filter.userFilter, page, sort)
            .then(result => {
                res.json({ code: "000000", data: result })
            })
            .catch(err => {
                console.log(err);
            })
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

    const device = new Device({
        ...req.body,
        createdBy: req.user._id
    })
    await device.save()
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
    if (!device) { throw new Error('设备不存在') }
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
    if (req.body.macAddress) {
        vField(req.body, ["_id", "name", "macAddress", "type"])
    } else if (req.body.status) {
        vField(req.body, ["_id", "status"])
    }

    // 根据mac/name查找设备 解决mac/name唯一问题
    await Device.isExist(req.body)

    const device = await Device.findOneAndUpdate({ $and: [{ _id: req.body._id, createdBy: req.user._id }] }, req.body, { new: true })
    if (!device) throw new Error('设备不存在')
    await device.save()
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

    const device = await Device.findOneAndDelete({ $and: [{ _id: req.body._id, createdBy: req.user._id }] })
    if (!device) { throw new Error('设备不存在') }
    res.json({ code: "000000", data: { data: device } })
}