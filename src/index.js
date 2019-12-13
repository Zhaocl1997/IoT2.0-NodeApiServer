'use strict'

const server = require('./app')
const chalk = require('chalk')
const port = process.env.SERVER_PORT
const mode = process.env.MODE

server.listen(port, '0.0.0.0', () => {
    console.log(
        chalk.black.bgWhite('API connected to server in %s on port %d'),
        mode,
        port
    )
})