'use strict'

const Data = require('./data.model')
const Role = require('../role/role.model')
const { vField } = require('../../helper/validate')

function data_index(type, page, sort, filter, time) {
    return new Promise((resolve, reject) => {
        Data.find({ flag: false })
            .find(time)
            .countDocuments()
            .exec((err, total) => {
                if (err) reject(err)
                Data.find({ flag: false })
                    .find(time)
                    .skip(page.skip)
                    .limit(page.limit)
                    .sort(sort)
                    .lean()
                    .populate({
                        path: "createdBy",
                        select: "name type",
                        populate: {
                            path: "createdBy",
                            select: "name"
                        }
                    })
                    .exec((err, data) => {
                        if (err) reject(err)
                        if (type === "byInit") {
                            resolve({ total, data })
                        } else {
                            const result = data.filter(filter)
                            resolve({ total, data: result })
                        }
                    })
            })
    })
}

/**
 * @method index
 * @param { Object } 
 * @returns { data }
 * @description public
 */
exports.index = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["sortOrder", "sortField", "pagenum", "pagerow", "condition", "type"])

    const sortOrder = req.body.sortOrder
    const sortField = req.body.sortField
    const pagenum = req.body.pagenum
    const pagerow = req.body.pagerow
    const con = req.body.condition
    const type = req.body.type

    // 排序
    let sort
    switch (sortField) {
        case "createdAt":
            sort = { createdAt: sortOrder }
            break;
        case "updatedAt":
            sort = { updatedAt: sortOrder }
            break;

        default:
            break;
    }

    // 分页
    const page = {
        skip: parseInt((pagenum - 1) * pagerow),
        limit: parseInt(pagerow)
    }

    switch (type) {
        case "byMac": // 根据mac
            await Data
                .find({ macAddress: con.macAddress })
                .countDocuments()
                .exec(async (err, total) => {
                    if (err) console.log(err)
                    await Data
                        .find({ macAddress: con.macAddress })
                        .limit(page.limit)
                        .sort({ createdAt: -1 })
                        .exec((err, data) => {
                            if (err) console.log(err)
                            res.json({ code: "000000", data: { data, total } })
                        })
                })
            break;

        case "byInit": // 默认刷新 没有条件
            data_index("byInit", page, sort)
                .then(data => {
                    res.json({ code: "000000", data })
                })
                .catch(err => {
                    console.log(err);
                })
            break;

        case "byUser": // 用户
            const userConditions = item => item.createdBy.createdBy._id.toString() === con.userID

            data_index("byUser", page, sort, userConditions)
                .then(data => {
                    res.json({ code: "000000", data })
                })
                .catch(err => {
                    console.log(err);
                })
            break;

        case "byType": // 设备类型
            const typeConditions = item =>
                item.createdBy.createdBy._id.toString() === con.userID &&
                item.createdBy.type === con.type

            data_index("byType", page, sort, typeConditions)
                .then(data => {
                    res.json({ code: "000000", data })
                })
                .catch(err => {
                    console.log(err);
                })
            break;

        case "byDevice": // 设备
            const devConditions = item =>
                item.createdBy.createdBy._id.toString() === con.userID &&
                item.createdBy.type === con.type &&
                item.createdBy._id.toString() === con.deviceID

            data_index("byDevice", page, sort, devConditions)
                .then(data => {
                    res.json({ code: "000000", data })
                })
                .catch(err => {
                    console.log(err);
                })
            break;

        case "byTime":
            const timeFilter = { createdAt: { $gte: con.time[0], $lte: con.time[1] } }

            const timeConditions = item =>
                item.createdBy.createdBy._id.toString() === con.userID &&
                item.createdBy.type === con.type &&
                item.createdBy._id.toString() === con.deviceID

            data_index("byTime", page, sort, timeConditions, timeFilter)
                .then(data => {
                    res.json({ code: "000000", data })
                })
                .catch(err => {
                    console.log(err);
                })
            break;

        default:
            break;
    }
}

/**
 * @method onLED
 * @param { Object }
 * @returns { json }
 * @description public 
 */
exports.onLED = async (req, res, next) => {
    require('../../services/mqtt').onLED(req.body)

    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method create
 * @param { Object } 
 * @returns { Boolean }
 * @description admin 
 */
exports.create = async (req, res, next) => {
    const data = new Data(req.body)
    await data.save()
    res.json({ code: '000000', data: { data } })
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

    const data = await Data.findById(req.body._id)
    data.flag = true
    await data.save()
    res.json({ code: '000000', data: { data: true } })
}