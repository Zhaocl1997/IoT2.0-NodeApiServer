/**
 * 配置文件
 */

'use strict'

const path = require('path')
const fs = require('fs')

// 路径
const staticPath = path.join(__dirname, process.env.STATIC_DIR)
const logPath = path.join(__dirname, process.env.ACCESSLOG_DIR)
const svgPath = path.join(__dirname, process.env.SVG_DIR)
const cameraPath = path.join(__dirname, process.env.CAMERA_DIR)
const avatarPath = path.join(__dirname, process.env.AVATAR_DIR)

// app静态文件配置
const staticOptions = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html', 'jpg'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
}

// 访问日志配置
const accessLogStream = fs.createWriteStream(
    logPath,
    { flags: "a" }
)

// 验证码配置
const svgOptions = {
    size: 4, // 验证码长度   
    ignoreChars: '0o1il', // 验证码字符中排除'0o1i'  
    noise: 5, // 干扰线条的数量
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    background: "#f4f3f2", // 验证码图片背景颜色   

    width: 130,
    height: 40,
    fontSize: 36,
    charPreset: "abcdefghijklmnpqrstuvwxyz1234567890"
}

module.exports = {
    staticOptions,
    staticPath,
    accessLogStream,
    svgOptions,
    svgPath,
    cameraPath,
    avatarPath
}