'use strict'

/**
 * db 链接
 */

const mongoose = require('mongoose')
const chalk = require('chalk')
mongoose.Promise = global.Promise

const uri = process.env.MONGODB_URI

const openConnect = async () => {
    await mongoose
        .connect(
            uri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
                autoIndex: false
            })
        .then(() =>
            console.log(chalk.black.bgWhite('Mongo connected to ' + uri)))
        .catch(err =>
            console.log(chalk.red.bgWhite('Mongodb connect error'), err))
}

const closeConnect = async () => {
    // await oracledb.getPool().close()  
}

const startupDB = async () => {
    try {
        await openConnect()
    } catch (err) {
        console.error(err)
        process.exit(1) // Non-zero failure code
    }
}

module.exports = {
    closeConnect,
    startupDB
}