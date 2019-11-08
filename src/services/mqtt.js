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
const { Data } = require('../api/data/data.model')

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
});

// 建立连接
client.on('connect', () => {
  console.log(chalk.black.bgBlue(clientId + ' connected to Mosca on port ' + port));

  // 订阅#以下所有级别的topic
  client.subscribe('api-engine/#');
  client.subscribe('pi/dht11/#');
  client.subscribe('pi/camera/#');
});

// 发送消息
client.on('message', (topic, message) => {
  // message is Buffer

  switch (topic) {

    case 'api-engine/dht11/feedback': // 反馈
      const dht11Mac = message.toString();
      console.log('PI3_DHT11 Response >> ', dht11Mac);
      client.publish('pi/dht11/feedback', 'API Got DHT11 Mac Address: ' + dht11Mac);
      break;

    case 'api-engine/camera/feedback': // 反馈
      const cameraMac = message.toString();
      console.log('PI3_Camera Response >> ', cameraMac);
      client.publish('pi/camera/feedback', 'API Got Camera Mac Address: ' + cameraMac);
      break;

    case 'pi/dht11/data':
      const DHT11Data = JSON.parse(message.toString());
      Data.create(DHT11Data, (err, data) => {
        if (err) return console.error(err);
        console.log('DHT11_Data Saved :', data.data);
      });
      break;

    default:
      break;
  }
});

// if (topic === 'camera') {
//   message = JSON.parse(message.toString());
//   // 将字符串转换为缓冲区
//   const image = Buffer.from(message.data.image, 'utf8');
//   const fname = message.data.id + '.jpg';
//   fs.writeFile(process.env.IMG_DIR + fname, image, "binary", function (err) {
//     if (err) {
//       console.log('[camera]', 'save failed', err);
//     } else {
//       console.log('[camera]', 'saved');
//     }
//   });
//   // 图片不会插入数据库,Gridfs会是个很好的选择 
//   delete message.data.image;
//   message.data.fname = fname;
//   // 为设备创建新的数据记录
//   Data.create(message, function (err, data) {
//     if (err) return console.error(err);
//     // 如果记录已成功保存,websockets将触发一条消息到web
//     // console.log('Data Saved :', data);
//   });
// }


exports.onDHT11 = (data) => {
  if (data === true) {
    client.publish('pi/dht11/start');
  } else
    if (data === false) {
      client.publish('pi/dht11/stop');
    }
}

exports.onLED = (data) => {
  if (data.l === true) {
    client.publish('pi/led/start');
  } else
    if (data.l === false) {
      client.publish('pi/led/stop');
    }
}

exports.onCamera = (data) => {
  if (data === true) {
    client.publish('pi/camera/start');
  } else
    if (data === false) {
      client.publish('pi/camera/stop');
    }
}