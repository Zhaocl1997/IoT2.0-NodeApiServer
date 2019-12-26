'use strict'

/**
 * 数据库初始化文件
 */

const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)

const chalk = require('chalk')
const mongoose = require('mongoose')

// Load models
const Route = require('../api/route/route.model')
const Menu = require('../api/menu/menu.model')
const Role = require('../api/role/role.model')
const User = require('../api/user/user.model')
const Device = require('../api/device/device.model')
const Data = require('../api/data/data.model')
const Article = require('../api/article/article.model')
const Category = require('../api/category/category.model')

const MONGO_URI = 'mongodb://192.168.0.112:27017/iot-api'

// Connect to DB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

// Import into DB
const importData = async () => {
    try {
        await exec(`mongoimport --uri="${MONGO_URI}" --collection=routes --file=./_data/route.json`)

        await exec(`mongoimport --uri="${MONGO_URI}" --collection=menus --file=./_data/menu.json`)

        await exec(`mongoimport --uri="${MONGO_URI}" --collection=roles --file=./_data/role.json`)

        await exec(`mongoimport --uri="${MONGO_URI}" --collection=users --file=./_data/user.json`)

        await exec(`mongoimport --uri="${MONGO_URI}" --collection=devices --file=./_data/device.json`)

        await exec(`mongoimport --uri="${MONGO_URI}" --collection=datas --file=./_data/data.json`)

        await exec(`mongoimport --uri="${MONGO_URI}" --collection=articles --file=./_data/article.json`)

        await exec(`mongoimport --uri="${MONGO_URI}" --collection=categories --file=./_data/category.json`)

        console.log(chalk.blue('Data imported...'))
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

// Delete data
const deleteData = async () => {
    try {
        await Route.deleteMany()
        await Menu.deleteMany()
        await Role.deleteMany()
        await User.deleteMany()
        await Device.deleteMany()
        await Data.deleteMany()
        await Article.deleteMany()
        await Category.deleteMany()

        console.log(chalk.red('Data destoryed...'))
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

if (process.argv[2] === '-i') {
    importData()
} else if (process.argv[2] === '-d') {
    deleteData()
}