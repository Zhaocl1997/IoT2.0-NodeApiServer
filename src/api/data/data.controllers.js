'use strict'

const { Data, validateData } = require('./data.model')
const ISODate = new Date().toISOString()

/**
 * @method index
 * @param { Object } req.body
 * @return { json }
 * @description 读取指定用户的指定设备信息 || public
 */
exports.index = async (req, res, next) => {
    // 参数
    const pagenum = req.body.pagenum
    const pagerow = req.body.pagerow
    const startTime = req.body.startTime || '2018-10-23T12:16:46.121Z'
    const endTime = req.body.endTime || '2020-10-23T12:16:46.121Z'
    const macAddress = req.body.macAddress

    // 验证用户提交数据是否合法
    const { error } = validateData({ macAddress });
    if (error) { return next(error) }

    // 数据数量
    const total = await Data
        .find({
            $and: [
                {
                    createdAt: {
                        $gte: startTime,
                        $lte: endTime
                    }
                },
                {
                    macAddress
                }
            ]
        })
        .countDocuments()

    console.log(total);


    // 数据
    const data = await Data
        .find({
            $or: [
                { macAddress },
                {
                    $and:
                        [
                            { macAddress },
                            { createdAt: { $gt: startTime } },
                            { createdAt: { $lt: endTime } }
                        ]
                }

            ]
        })
        .skip(parseInt((pagenum - 1) * pagerow))
        .limit(parseInt(pagerow))
        .sort({ createdAt: -1 })

    res.json({ code: "000000", data: { total, data } })
}

/**
 * @method create
 * @param { Object } req.body
 * @return { json }
 * @description 新建指定设备的数据信息 || public 
 */
exports.create = async (req, res, next) => {
    const { error } = validateData({ macAddress: req.body.macAddress });
    if (error) { return next(error) }

    const data = new Data({
        ...req.body,
        createdBy: req.user._id
    })
    const result = await data.save()
    if (result) { require('../../services/mqtt').sendLEDData(result.data.l) }

    res.json({ code: "000000", data: result })
}