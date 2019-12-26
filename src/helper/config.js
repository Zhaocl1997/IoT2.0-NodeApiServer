/**
 * 配置文件
 */

'use strict'

const fs = require('fs')
const path = require('path')
const Logger = require('../api/logger/logger.model')
const { timeFormat } = require('../helper/public')

// 路径
const staticPath = path.join(__dirname, process.env.STATIC_DIR)
// const logPath = path.join(__dirname, process.env.ACCESSLOG_DIR)
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

// margan 文件
// const accessLogStream = fs.createWriteStream(
//     logPath,
//     { flags: "a" }
// )

// morgan 数据库
const morganOptions = (tokens, req, res) => {
    const method = tokens['method'](req, res)
    const url = tokens['url'](req, res)
    const httpVersion = tokens['http-version'](req, res)
    const statusCode = tokens['status'](req, res) || 500
    const referrer = tokens['referrer'](req, res) || 'postman'
    const userAgent = tokens['user-agent'](req, res)
    const remoteAddress = req.headers.clientip || '127.0.0.1'
    const requestTime = timeFormat(tokens['date'](req, res), 'YYYY-MM-DD HH:mm:ss')
    const responseTime = tokens['response-time'](req, res) || 0
    const username = req.user ? req.user.name : 'notLoggedIn'

    if (method === 'POST') {
        Logger.create({
            method,
            url,
            httpVersion,
            statusCode,
            referrer,
            userAgent,
            remoteAddress,
            requestTime,
            responseTime,
            username
        })
    }
}

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
    // accessLogStream,
    morganOptions,
    svgOptions,
    svgPath,
    cameraPath,
    avatarPath
}