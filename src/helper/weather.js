const http = require('http')
const zlib = require('zlib')

const getWeather = (IP) => {
    const config = new URL(`http://api.map.baidu.com/location/ip?ak=F454f8a5efe5e577997931cc01de3974&ip=${IP}`)

    return new Promise((resolve, reject) => {
        const client = http.request(config, (res) => {
            res.on("data", (chunk) => {
                const city = JSON.parse(chunk.toString()).content.address_detail.city
                const config = new URL(encodeURI(`http://wthrcdn.etouch.cn/weather_mini?city=${city}`))

                const client = http.request(config, (res) => {
                    res.on("data", (chunk) => {
                        zlib.unzip(chunk, (err, buffer) => {
                            if (err) console.log(err)
                            let data = JSON.parse(buffer.toString())
                            resolve(data.data);
                        });
                    })
                })
                client.end()
            })
        })
        client.end()
    })
}

module.exports = getWeather