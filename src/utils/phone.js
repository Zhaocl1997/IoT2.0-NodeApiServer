'use strict'

const Core = require('@alicloud/pop-core')

function sendValidatePhone(PhoneNumbers, code) {
    return new Promise((res, rej) => {
        const accessKeyId = process.env.ALI_KEYID
        const accessKeySecret = process.env.ALI_KEYSECRET
        const endpoint = process.env.ALI_SMS_ENDPOINT
        const apiVersion = process.env.ALI_SMS_VERSION
        const RegionId = process.env.ALI_SMS_REGION
        const TemplateCode = process.env.ALI_SMS_TEMPLATECODE

        const client = new Core({
            accessKeyId,
            accessKeySecret,
            endpoint,
            apiVersion
        })

        const params = {
            RegionId: RegionId,
            PhoneNumbers,
            SignName: "IoT管理平台",
            TemplateCode,
            TemplateParam: `{"code":"${code}"}`
        }

        const requestOption = {
            method: 'POST'
        }

        client
            .request('SendSms', params, requestOption)
            .then((result) => {
                const { Message, Code } = result
                if (Message === 'OK' && Code === 'OK') res(true)
            }, (err) => {
                console.log(err)
                rej(false)
            })
    })
}

module.exports = sendValidatePhone