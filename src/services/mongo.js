/**
 * mongo 配置
 */

'use strict'

const mongoose = require('mongoose');
const chalk = require('chalk')
mongoose.Promise = global.Promise;

function openConnect() {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
        .then(() => console.log(chalk.black.bgMagenta('Mongo connected to ' + process.env.MONGODB_URL)))
        .catch(err => console.log(chalk.black.bgRed('Mongodb connect error'), err))
}

async function closeConnect() {
    //await oracledb.getPool().close();  
}

async function startupDB() {
    try {
        openConnect();
    } catch (err) {
        console.error(err);
        process.exit(1); // Non-zero failure code
    }
}

module.exports = {
    closeConnect,
    startupDB
}