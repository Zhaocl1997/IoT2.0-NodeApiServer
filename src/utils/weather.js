const http = require('http')
const zlib = require('zlib')

const getWeather = (IP) => {
    const config = new URL(`http://api.map.baidu.com/location/ip?ak=${process.env.BAIDU_AK}&ip=${IP}`)

    return new Promise((resolve, reject) => {
        const client = http.request(config, (res) => {
            res.on("data", (chunk) => {

                if (JSON.parse(chunk.toString()).status === 2) return;

                const city = JSON.parse(chunk.toString()).content.address_detail.city
                const config = new URL(encodeURI(`http://wthrcdn.etouch.cn/weather_mini?city=${city}`))

                const client = http.request(config, (res) => {
                    res.on("data", (chunk) => {
                        zlib.unzip(chunk, (err, buffer) => {
                            if (err) reject(err)
                            let data = JSON.parse(buffer.toString())
                            resolve(data.data);
                        });
                    })
                })
                client.on('error', (e) => {
                    reject(e)
                })
                client.end()
            })
        })
        client.on('error', (e) => {
            reject(e)
        })
        client.end()
    })
}

module.exports = getWeather