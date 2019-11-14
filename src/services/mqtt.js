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
  console.log(chalk.black.bgBlue(clientId + ' connected to Mosca on port ' + port))

  // 订阅#以下所有级别的topic
  client.subscribe('api-engine/#')
  client.subscribe('pi/dht11/#')
  client.subscribe('pi/camera/#')
})

// 发送消息
client.on('message', (topic, message) => {
  // message is Buffer

  switch (topic) {

    case 'api-engine/dht11/feedback': // 反馈
      const dht11Mac = message.toString()
      console.log('PI3_DHT11 Response >> ', dht11Mac)
      client.publish('pi/dht11/feedback', 'API Got DHT11 Mac Address: ' + dht11Mac)
      break

    case 'api-engine/camera/feedback': // 反馈
      const cameraMac = message.toString()
      console.log('PI3_Camera Response >> ', cameraMac)
      client.publish('pi/camera/feedback', 'API Got Camera Mac Address: ' + cameraMac)
      break

    case 'pi/dht11/data':
      const DHT11Data = JSON.parse(message.toString())
      Data.create(DHT11Data, (err, data) => {
        if (err) return console.error(err)
        console.log('DHT11_Data Saved :', data.data)
      })
      break

    case 'pi/camera/data':
      const cameraData = JSON.parse(message.toString())
      const image = Buffer.from(cameraData.data.image, 'utf8')
      const fname = cameraData.data.id + '.jpg'
      fs.writeFile(process.env.IMG_DIR + fname, image, "binary", (err) => {
        if (err) {
          console.log('[camera]', 'save failed', err)
        } else {
          console.log('[camera]', 'saved')
        }
      })
      delete cameraData.data.image
      delete cameraData.data.id
      cameraData.data.fname = fname
      Data.create(cameraData, (err, data) => {
        if (err) return console.error(err)
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
  if (data === true) {
    client.publish('pi/camera/start')
  } else
    if (data === false) {
      client.publish('pi/camera/stop')
    }
}