'use strict'

const mongoose = require('mongoose')
const Data = require('./data.model')
const Device = require('../device/device.model')
const { vField } = require('../../helper/validate')
const { index_params } = require('../../helper/public')

const data_aggregate = (page, sort, filter) => {
    // 合并
    const group = [
        {
            '$group': {
                '_id': '$cB',
                'data': {
                    '$push': {
                        '_id': '$_id',
                        'data': '$data',
                        'flag': '$flag',
                        'cA': '$cA'
                    }
                }
            }
        }
    ]

    // 获取设备用户信息
    const lookup = [
        {
            '$lookup': {
                'from': 'devices',
                'localField': '_id',
                'foreignField': '_id',
                'as': 'cB'
            }
        },
        { '$unwind': "$cB" },
        {
            '$lookup': {
                'from': 'users',
                'localField': 'cB.createdBy',
                'foreignField': '_id',
                'as': 'cB.createdBy'
            }
        },
        { '$unwind': "$cB.createdBy" }
    ]

    // 重构
    const project = [
        {
            '$project': {
                '_id': 1,
                'total': 1,
                'devicetype': '$cB.type',
                'devicename': '$cB.name',
                'userID': '$cB.createdBy._id',
                'username': '$cB.createdBy.name',
                'data': 1
            }
        }
    ]

    // 过滤
    const match = filter ? [filter] : []

    // 结果
    const facet = [
        {
            '$facet': {
                'total': [
                    { '$match': { 'data.flag': false } },
                    { '$count': 'value' }
                ],
                'data': [
                    { '$match': { 'data.flag': false } },
                    { '$sort': sort },
                    { '$skip': page.skip },
                    { '$limit': page.limit }
                ]
            }
        },
        { '$unwind': '$total' }
    ]

    // 语句
    const query = [
        ...group,
        ...lookup,
        ...project,
        ...match,
        { '$unwind': '$data' }, // 拆分
        ...facet,
    ]

    return new Promise((resolve, reject) => {
        Data.aggregate(query).allowDiskUse(true).exec((err, data) => {
            if (err) reject(err)
            const res = data.length === 0
                ? { total: 0, data: [] }
                : { total: data[0].total.value, data: data[0].data }

            resolve(res)
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

    const sortOrder = req.body.sortOrder === 'ascending' ? 1 : -1
    const sortField = req.body.sortField
    const pagenum = req.body.pagenum
    const pagerow = req.body.pagerow
    const con = req.body.condition
    const type = req.body.type

    // 排序
    let sort
    switch (sortField) {
        case "cA":
            sort = { 'data.cA': sortOrder }
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
        case "byInit": { // 默认刷新 没有条件
            const data = await data_aggregate(page, sort)
            res.json({ code: "000000", data })
        } break;

        case "byUser": { // 用户
            const userID = mongoose.Types.ObjectId(con.userID)
            const filter = {
                '$match': {
                    '$and': [
                        { 'userID': userID }
                    ]
                }
            }

            const data = await data_aggregate(page, sort, filter)
            res.json({ code: "000000", data })
        } break;

        case "byType": { // 设备类型
            const userID = mongoose.Types.ObjectId(con.userID)
            const deviceType = con.type
            const filter = {
                '$match': {
                    '$and': [
                        { 'userID': userID },
                        { 'devicetype': deviceType }
                    ]
                }
            }

            const data = await data_aggregate(page, sort, filter)
            res.json({ code: "000000", data })
        } break;

        case "byDevice": { // 设备
            const userID = mongoose.Types.ObjectId(con.userID)
            const deviceType = con.type
            const deviceID = mongoose.Types.ObjectId(con.deviceID)
            const filter = {
                '$match': {
                    '$and': [
                        { 'userID': userID },
                        { 'devicetype': deviceType },
                        { '_id': deviceID }
                    ]
                }
            }

            const data = await data_aggregate(page, sort, filter)
            res.json({ code: "000000", data })
        } break;

        case "byTime": {
            const userID = mongoose.Types.ObjectId(con.userID)
            const deviceType = con.type
            const deviceID = mongoose.Types.ObjectId(con.deviceID)
            const start = con.time[0]
            const stop = con.time[1]
            const filter = {
                '$match': {
                    '$and': [
                        { 'userID': userID },
                        { 'devicetype': deviceType },
                        { '_id': deviceID },
                        { 'data.cA': { '$gte': new Date(start), '$lte': new Date(stop) } }
                    ]
                }
            }

            const data = await data_aggregate(page, sort, filter)
            res.json({ code: "000000", data })
        } break;

        default:
            break;
    }
}

/**
 * @method indexByMac
 * @param { Object } 
 * @returns { data }
 * @description public
 */
exports.indexByMac = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["pagerow", "pagenum", "macAddress"])

    const base = index_params(req.body)

    const device = await Device.findOne({ macAddress: req.body.macAddress })

    const total = await Data.find({ cB: device._id }).countDocuments()
    const data = await Data.find({ cB: device._id })
        .limit(base.limit).skip(base.skip).sort({ cA: -1 })

    res.json({ code: "000000", data: { data, total } })
}

/**
 * @method onLED
 * @param { Object }
 * @returns { Boolean }
 * @description public 
 */
exports.onLED = async (req, res, next) => {
    // 验证字段
    vField(req.body, ["status", "macAddress"])

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
    const data = await Data.create(req.body)
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