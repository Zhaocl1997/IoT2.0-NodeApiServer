'use strict'

const net = require('net')

function sendValidateEmail(email, code) {
    return new Promise((res, rej) => {
        try {
            function sendData(msg) {
                // console.log('发送：' + msg)
                client.write(msg + '\r\n')
            }

            let data = null
            function getData() {
                return new Promise((resolve, reject) => {
                    next()
                    function next() {
                        if (data) {
                            let temp = data
                            data = null
                            resolve(temp)
                        } else {
                            setTimeout(next, 0)
                        }
                    }
                })
            }

            const host = process.env.EMAIL_HOST
            const port = process.env.EMAIL_PORT
            const user = process.env.EMAIL_USER
            const pass = process.env.EMAIL_PASS
            const to = email
            const subject = 'IoT平台验证码'
            const msg = `【IoT管理平台】欢迎使用IoT邮箱验证服务，验证码${code}。如非本人操作，请检查账号安全。`


            const client = net.createConnection({ host, port }, async () => {

                await getData()
                sendData('HELO ' + host)

                await getData()
                sendData('auth login')

                await getData()
                sendData(Buffer.from(user).toString('base64'))

                await getData()
                sendData(Buffer.from(pass).toString('base64'))

                await getData()
                sendData(`MAIL FROM:<${user}>`)

                await getData()
                sendData(`RCPT TO:<${to}>`)

                await getData()
                sendData('DATA')

                await getData()
                sendData(`SUBJECT:${subject}`)
                sendData(`FROM:${user}`)
                sendData(`TO:${to}\r\n`)
                sendData(`${msg}\r\n.`)

                await getData()
                sendData(`QUIT`)
            })

            client.on('data', d => {
                data = d.toString().substring(0, 3)
            })

            client.on('end', () => {
                // console.log('连接断开')
                res(true)
            })
        } catch (error) {
            console.log(error);
            rej(false)
        }
    })
}

module.exports = sendValidateEmail