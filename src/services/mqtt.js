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

// 实例化对象
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
  console.log(chalk.black.bgBlue('MQTT connected to Mosca at ' + host + ' on port ' + port));

  // 订阅
  client.subscribe('api-engine');
  client.subscribe('dht11');
  client.subscribe('image');
});

// 发送消息
client.on('message', (topic, message) => {

  // message is Buffer
  // console.log('Topic >> ', topic);
  // console.log('Message >> ', message.toString());

  if (topic === 'api-engine') {
    // 订阅主题为api-engine
    const macAddress = message.toString();
    console.log('Mac Address >> ', macAddress);

    // 发布rpi
    client.publish('rpi', 'Got Mac Address: ' + macAddress);
  } else if (topic === 'dht11') {
    // 订阅主题为dht11
    const data = JSON.parse(message.toString());
    // 把数据插入数据库
    Data.create(data, (err, data) => {
      if (err) return console.error(err);
      // 如果数据成功保存,log新的数据
      console.log('Data Saved :', data.data);
    });
  } else if (topic === 'image') {
    // 订阅主题为image
    message = JSON.parse(message.toString());
    // 将字符串转换为缓冲区
    const image = Buffer.from(message.data.image, 'utf8');
    const fname = message.data.id + '.jpg';
    fs.writeFile(process.env.IMG_DIR + fname, image, "binary", function (err) {
      if (err) {
        console.log('[image]', 'save failed', err);
      } else {
        console.log('[image]', 'saved');
      }
    });
    // 图片不会插入数据库,Gridfs会是个很好的选择 
    delete message.data.image;
    message.data.fname = fname;
    // 为设备创建新的数据记录
    Data.create(message, function (err, data) {
      if (err) return console.error(err);
      // 如果记录已成功保存,websockets将触发一条消息到web
      // console.log('Data Saved :', data);
    });

  } else {
    console.log('Unknown topic', topic);
  }
});

// 发送LED数据
exports.sendLEDData = (data) => {
  console.log('Sending Data', data);
  // 发布led
  client.publish('led', data);
}