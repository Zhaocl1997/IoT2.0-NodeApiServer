'use strict'

const path = require('path')
const mongoose = require('mongoose')
const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)

const uri = process.env.MONGODB_URI

// 连接数据库
const mgsCollection = async () => {
    await mongoose
        .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
            autoIndex: false
        })

    mongoose.connection.on('open', () => {
        return;
    })
}

// 获取collection名字
const getColNames = async () => {
    await mgsCollection() // open了才有mongoose.connection.db
    let cols = await mongoose.connection.db.collections()
    let arr = []
    for (let c of cols) {
        arr.push(c.s.namespace.collection)
    }
    return arr
}

// 获取collection状态信息
const getStatsInfo = async (colname) => {
    const shell = `mongo ${uri} --eval "db.${colname}.stats()" --quiet`
    const result = await exec(shell)
    return result.stdout
}

// 获取collection信息
const getColInfo = async () => {
    const colNames = await getColNames()

    let arr = []
    for (let i = 0; i < colNames.length; i++) {
        const name = colNames[i];
        const str = await getStatsInfo(name)
        const result = JSON.parse(str)

        arr.push({
            colname: name,
            colcount: result.count + ' 条',
            colsize: (result.size / 1024).toFixed(2) + ' KB'
        })
    }
    return arr
}

// export
const exportDB = async (colname) => {  
    const args = [
        `--uri="${uri}"`,
        `--collection="${colname}"`,
        `--out="${path.resolve('../_db')}/backup.json"`
    ]
    const shell = `mongoexport ${args[0]} ${args[1]} ${args[2]}`
    await exec(shell)
}

// import
const importDB = async (colname) => {
    const args = [
        `--uri="${uri}"`,
        `--collection="${colname}"`,
        `--file="${path.resolve('../_db')}/backup.json"`
    ]
    const shell = `mongoimport ${args[0]} ${args[1]} ${args[2]}`
    await exec(shell)
}

module.exports = { getColInfo, exportDB, importDB }