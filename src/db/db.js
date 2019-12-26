'use strict'

/**
 * 关于DB的一些方法
 */

const Article = require('../api/article/article.model')
const Category = require('../api/category/category.model')
const Data = require('../api/data/data.model')
const Device = require('../api/device/device.model')
const Logger = require('../api/logger/logger.model')
const Menu = require('../api/menu/menu.model')
const Role = require('../api/role/role.model')
const Route = require('../api/route/route.model')
const User = require('../api/user/user.model')

const path = require('path')
const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)

// 通过model获取统计信息
const stats = async (arr) => {
    let result = []
    for (let i = 0; i < arr.length; i++) {
        const model = arr[i];
        const res = await model.collection.stats()
        result.push({
            colname: res.ns.split('.')[1],
            colcount: res.count + ' 条',
            colsize: (res.size / 1024).toFixed(2) + ' KB'
        })
    }
    return result
}

// 获取collection信息
const getColInfo = async () => {
    const models = [Article, Category, Data, Device, Logger, Menu, Role, Route, User]
    const arr = await stats(models)
    return arr
}

// export
const exportDB = async (colname) => {
    const args = [
        `--uri="${process.env.MONGODB_URI}"`,
        `--collection="${colname}"`,
        `--out="${path.resolve('../_db')}/backup.json"`
    ]
    const shell = `mongoexport ${args[0]} ${args[1]} ${args[2]}`
    await exec(shell)
}

// import
const importDB = async (colname) => {
    const args = [
        `--uri="${process.env.MONGODB_URI}"`,
        `--collection="${colname}"`,
        '--mode upsert', // 更新，避免duplicate key
        `--file="${path.resolve('../_db')}/backup.json"`
    ]
    const shell = `mongoimport ${args[0]} ${args[1]} ${args[2]} ${args[3]}`
    await exec(shell)
}

module.exports = { getColInfo, exportDB, importDB }