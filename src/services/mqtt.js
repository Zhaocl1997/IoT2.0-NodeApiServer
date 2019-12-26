/**
 * MQTT 配置
 */

'use strict'

const mqtt = require('mqtt')
const chalk = require('chalk')
const Data = require('../api/data/data.model')
const Device = require('../api/device/device.model')
const clientId = process.env.MQTT_CLIENTID
const port = process.env.MQTT_PORT
const protocol = process.env.MQTT_PROTOCOL
const host = process.env.MQTT_HOST

// mqtt config
const clientConfig = {
  port,
  protocol,
  host,
  clientId,
  reconnectPeriod: 1000,
  username: clientId,
  password: clientId,
  keepalive: 300,
  rejectUnauthorized: false
}

// mqtt client
const client = mqtt.connect(clientConfig)

// mqtt topic
const topic = (mac) => {
  return {
    subscribe: {
      feedback: 'api/feedback',
      dht11: 'api/pi/dht11/data',
      camera: 'api/pi/camera/data'
    },
    publish: {
      feedback: `device/feedback/${mac}`,
      dht11: {
        start: `device/pi/dht11/${mac}/start`,
        stop: `device/pi/dht11/${mac}/stop`
      },
      led: {
        start: `device/pi/led/${mac}/start`,
        stop: `device/pi/led/${mac}/stop`
      },
      camera: {
        start: `device/pi/camera/${mac}/start`,
        stop: `device/pi/camera/${mac}/stop`
      }
    }
  }
}

// mqtt connect
client.on('connect', () => {
  console.log(chalk.black.bgWhite(clientId + ' connected to ' + host + ' on port ' + port))

  // subscribe
  client.subscribe(topic().subscribe.feedback)

  client.subscribe(topic().subscribe.dht11)
  client.subscribe(topic().subscribe.camera)
})

// mqtt message
client.on('message', async (topicMsg, message) => {
  // message is Buffer

  switch (topicMsg) {
    // feedback
    case topic().subscribe.feedback: {
      const mac = message.toString()

      // 检测是否是新设备
      const device = await Device.findOne({ macAddress: mac })
      if (!device) { require('../helper/socket').onNewDevice({ macAddress: mac }) }
      console.log('Device Response >> ', mac)

      // 发布API的反馈
      client.publish(topic(mac).publish.feedback, mac)
    } break;

    case topic().subscribe.dht11: {
      const data = JSON.parse(message.toString())
      const device = await Device.findOne({ macAddress: data.macAddress })
      delete data.macAddress
      const result = new Data({ ...data, cB: device._id })
      await result.save()
      console.log('DHT11_Data Saved')
    } break;

    case topic().subscribe.camera: {
      const data = JSON.parse(message.toString())      
      const device = await Device.findOne({ macAddress: data.macAddress })
      delete data.macAddress
      const result = new Data({ ...data, cB: device._id })
      await result.save()
      console.log('Camera_Data Saved')
    } break;

    default:
      break;
  }
})

exports.onDHT11 = (data) => {
  if (data.status === true) {
    client.publish(topic(data.macAddress).publish.dht11.start)
  } else
    if (data.status === false) {
      client.publish(topic(data.macAddress).publish.dht11.stop)
    }
}

exports.onLED = (data) => {
  if (data.status === true) {
    client.publish(topic(data.macAddress).publish.led.start)
  } else
    if (data.status === false) {
      client.publish(topic(data.macAddress).publish.led.stop)
    }
}

exports.onCamera = (data) => {
  if (data.status === true) {
    client.publish(topic(data.macAddress).publish.camera.start)
  } else
    if (data.status === false) {
      client.publish(topic(data.macAddress).publish.camera.stop)
    }
}