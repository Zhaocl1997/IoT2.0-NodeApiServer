'use strict'

const multer = require('multer')
const { avatarPath } = require('../../helper/config')
const base = require('../base')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, avatarPath)
    },
    filename(req, file, cb) {
        const filename = req.user._id + '/' + new Date().valueOf()
        cb(null, filename)
    }
})

const limits = {
    fileSize: 1000000
}

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('请上传图片'))
    }
    cb(null, true)
}

// 实例化multer
const avatar = multer({
    // storage: storage, // 到接口用sharp裁剪一下，需要注释
    limits: limits,
    fileFilter: fileFilter
}).single('avatar')

const avatarMW = [base, avatar]

module.exports = avatarMW