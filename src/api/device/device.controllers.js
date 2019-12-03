'use strict'

const Device = require('./device.model')
const Role = require('../role/role.model')

function deviceIndex(filter, page, sort) {
    return new Promise(async (resolve, reject) => {
        await Device
            .find(filter)
            .countDocuments()
            .exec(async (err, total) => {
                if (err) reject(err)
                await Device
                    .find(filter)
                    .skip(parseInt((page.pagenum - 1) * page.pagerow))
                    .limit(parseInt(page.pagerow))
                    .sort(sort)
                    .populate({
                        path: 'dataCount',
                        options: {
                            lean: true
                        }
                    })
                    .populate({
                        path: 'createdBy',
                        select: 'name'
                    })
                    .lean()
                    .exec((err, data) => {
                        if (err) reject(err)
                        resolve({ code: "000000", data: { total, data } })
                        // res.json({ code: "000000", data: { total, data } })
                    })
            })
    })
}

/**
 * @method index
 * @param { Object } req.body
 * @return { json }
 * @description 获取用户的所有设备信息 || public 
 */
exports.index = async (req, res, next) => {
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
        pagenum,
        pagerow
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
        deviceIndex(filter.adminFilter, page, sort)
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        deviceIndex(filter.userFilter, page, sort)
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                console.log(err);
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
    // 根据mac/name查找设备 解决mac/name唯一问题
    await Device.isExist(req.body)

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
    const device = await Device.findOne({ $and: [{ _id: req.body._id, createdBy: req.user._id }] })
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
    // 根据mac/name查找设备 解决mac/name唯一问题
    await Device.isExist(req.body)

    const device = await Device.findByIdAndUpdate(req.body._id, req.body, { new: true })
    res.json({ code: "000000", data: device })
}

/**
 * @method delete
 * @param { Object } req.body
 * @return { json }
 * @description 删除指定用户的指定设备信息 || public
 */
exports.delete = async (req, res, next) => {
    const device = await Device.findOneAndDelete({ $and: [{ _id: req.body._id, createdBy: req.user._id }] })
    if (!device) { throw new Error('设备不存在') }
    res.json({ code: "000000", data: device })
}