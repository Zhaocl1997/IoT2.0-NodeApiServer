'use strict'

const path = require('path')
const OSS = require('ali-oss')

const region = process.env.OSS_REGION
const accessKeyId = process.env.OSS_KEYID
const accessKeySecret = process.env.OSS_KEYSECRET
const bucket = process.env.OSS_BUCKET

// 实例化OSS
const client = new OSS({
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
    timeout: 600000 // 超时10分钟
})

// 上传
const uploadDB = async (dbname, colname, filename) => {
    const cloudDir = `mongo/${dbname}/${colname}/${filename}`
    const localDir = `${path.resolve('../_db')}/backup.json`
    // const stream = fs.createReadStream(localDir)
    await client.put(cloudDir, localDir)
}

// 下载
const downloadDB = async (dbname, colname, filename) => {
    const cloudDir = `mongo/${dbname}/${colname}/${filename}`
    const localDir = `${path.resolve('../_db')}/backup.json`
    await client.get(cloudDir, localDir)
}

// 列出目录
const listDir = async (dir) => {
    const result = await client.list({ prefix: dir, delimiter: '/' })

    if (result.objects === undefined) return;

    let arr = []
    result.objects.forEach((obj) => {
        arr.push({
            name: obj.name.split('/')[3],
            url: obj.url
        })
    })
    return arr
}

module.exports = { uploadDB, downloadDB, listDir }