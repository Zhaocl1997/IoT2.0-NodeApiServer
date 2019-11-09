'use strict'

const Data = require('./data.model')

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
 * @method onLED
 * @param { Object } req.body
 * @return { json }
 * @description 改变LED状态 || public 
 */
exports.onLED = async (req, res, next) => {
    require('../../services/mqtt').onLED(req.body)

    res.json({ code: "000000" })
}