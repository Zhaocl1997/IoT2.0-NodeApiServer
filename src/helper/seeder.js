const fs = require('fs')
const chalk = require('chalk')
const mongoose = require('mongoose')

// Load models
const Route = require('../api/route/route.model')
const Menu = require('../api/menu/menu.model')
const Role = require('../api/role/role.model')
const User = require('../api/user/user.model')
const Device = require('../api/device/device.model')
const Data = require('../api/data/data.model')

const MONGO_URI = 'mongodb://172.17.86.199:27017/iot-api'

// Connect to DB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

// Read JSON files
const routes = JSON.parse(fs.readFileSync('../_data/route.json', 'utf-8'))
const menus = JSON.parse(fs.readFileSync('../_data/menu.json', 'utf-8'))
const roles = JSON.parse(fs.readFileSync('../_data/role.json', 'utf-8'))
const users = JSON.parse(fs.readFileSync('../_data/user.json', 'utf-8'))
const devices = JSON.parse(fs.readFileSync('../_data/device.json', 'utf-8'))
const datas = JSON.parse(fs.readFileSync('../_data/data.json', 'utf-8'))

// Import into DB
const importData = async () => {
    try {
        // await Route.create(routes)
        // await Menu.create(menus)
        // await Role.create(roles)
        // await User.create(users)
        // await Device.create(devices)
        await Data.create(datas)

        console.log(chalk.blue('Data imported...'));
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

// Delete data
const deleteData = async () => {
    try {
        // await Route.deleteMany()
        // await Menu.deleteMany()
        // await Role.deleteMany()
        // await User.deleteMany()
        // await Device.deleteMany()
        await Data.deleteMany()

        console.log(chalk.red('Data destoryed...'));
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