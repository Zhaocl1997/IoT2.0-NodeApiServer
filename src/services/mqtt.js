/**
 * MQTT 配置
 */

'use strict'

const fs = require('fs')
const mqtt = require('mqtt')
const chalk = require('chalk')
const port = process.env.MQTT_PORT
const host = process.env.MQTT_HOST
const clientId = process.env.MQTT_CLIENTID
const Data = require('../api/data/data.model')
const { cameraPath } = require('../helper/config')

// MQTT client
const client = mqtt.connect({
  port: port,
  protocol: 'mqtts',
  host: host,
  clientId: clientId,
  reconnectPeriod: 1000,
  username: clientId,
  password: clientId,
  keepalive: 300,
  rejectUnauthorized: false
})

// 建立连接
client.on('connect', () => {
  console.log(chalk.black.bgBlue(clientId + ' connected to ' + host + ' on port ' + port))

  // 订阅设备的反馈
  client.subscribe('api/feedback')

  client.subscribe('api/pi/dht11/data')
  client.subscribe('api/pi/camera/data')
})

// 发送消息
client.on('message', (topic, message) => {
  // message is Buffer

  switch (topic) {
    // 反馈
    case 'api/feedback':
      const mac = message.toString()
      console.log('Device Response >> ', mac)

      // 发布API的反馈
      client.publish(`device/feedback/${mac}`, mac)
      break

    case 'api/pi/dht11/data':
      const DHT11Data = JSON.parse(message.toString())
      Data.create(DHT11Data, (err, data) => {
        if (err) throw new Error(err)
        console.log('DHT11_Data Saved :', data.data)
      })
      break

    case 'api/pi/camera/data':
      const cameraData = JSON.parse(message.toString())
      // const image = Buffer.from(cameraData.data.image, 'utf8')
      // const fname = cameraData.data.id + '.jpg'

      // fs.writeFile(
      //   cameraPath + fname,
      //   image,
      //   "binary",
      //   (err) => {
      //     if (err) throw err;
      //     console.log('[camera]', 'saved')
      //   })

      // delete cameraData.data.image
      // delete cameraData.data.id
      // cameraData.data.fname = fname

      Data.create(cameraData, (err, data) => {
        if (err) throw new Error(err)
        console.log('Camera_Data Saved :', data.data)
      })
      break

    default:
      break
  }
})

exports.onDHT11 = (data) => {
  if (data === true) {
    client.publish('pi/dht11/start')
  } else
    if (data === false) {
      client.publish('pi/dht11/stop')
    }
}

exports.onLED = (data) => {
  if (data.l === true) {
    client.publish('pi/led/start')
  } else
    if (data.l === false) {
      client.publish('pi/led/stop')
    }
}

exports.onCamera = (data) => {
  if (data.status === true) {
    client.publish(`device/pi/camera/${data.macAddress}/start`)
  } else
    if (data.status === false) {
      client.publish(`device/pi/camera/${data.macAddress}/stop`)
    }
}