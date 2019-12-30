'use strict'

const ROAClient = require('@alicloud/pop-core').ROAClient

const accessKeyId = 'LTAI4FgftiCV8nQqGWGdNa9t' // process.env.OSS_KEYID
const accessKeySecret = 'zJN2va3SqPQ4bLEiOtzrjixACL35aI' // process.env.OSS_KEYSECRET

const client = new ROAClient({
    accessKeyId,
    accessKeySecret,
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
})


// => returns Promise
// request(HTTPMethod, uriPath, queries, body, headers, options);
// options => {timeout}
client.request('GET', '/regions').then(res => {
    console.log(res);

})
// co/yield, async/await