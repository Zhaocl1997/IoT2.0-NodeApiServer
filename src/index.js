'use strict'

const server = require('./app')
const chalk = require('chalk')
const port = process.env.SERVER_PORT
const mode = process.env.MODE

server.listen(port, () => {
    console.log(
        chalk
            .black
            .bgYellow(
                'API connected to server in %s on port %d'
            ),
        mode,
        port
    )
})