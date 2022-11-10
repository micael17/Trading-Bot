const axios = require('axios')
const https = require('https')
const moment = require('moment')
const crypto = require('crypto')


/**
 * The request header of ACCESS-SIGN is to encrypt
 * timestamp + method.toUpperCase() + requestPath + "?" + queryString + body string (+ means string concat)
 * by HMAC SHA256 algorithm with secretKey. and encode the encrypted result through BASE64.
 *
 * For example

 Get contract depth information, let's take BTCUSDT_UMCBL as an example:

 timestamp = 16273667805456
 method = "GET"
 requestPath = "/api/mix/V1/market/depth"
 queryString= "?symbol=BTCUSDT_UMCBL&limit=20"
 Generate the content to be signed:

 16273667805456GET/api/mix/v1/market/depth?symbol=BTCUSDT_UMCBL&limit=20

 Contract order, take BTCUSDT_UMCBL as an example:

 timestamp = 16273667805456
 method = "POST"
 requestPath = "/api/mix/v1/order/placeOrder"
 body = {"symbol":"BTCUSDT_UMCBL","size":"8","side":"open_long","orderType":"limit","client_oid":"bitget#123456"}

 16273667805456POST/api/mix/v1/order/placeOrder{"symbol":"BTCUSDT_UMCBL","size":"8","side":"open_long","order_type":"limit","client_oid":"bitget#123456"}

 Steps to generate the final signature

 Step 1. Use the private key secretkey to encrypt the content with hmac sha256

 String payload = hmac_sha256(secretkey, content);

 The second step is to base64 encode the payload

 String signature = base64.encode(payload);
 */

const $axios = ( function () {

    const secretKey = '02bb10a98085573bf679ae939a78216f61824f90d47af176e76c49dd88bc64b6'
    const bitgetUrl = 'https://api.bitget.com'

    const timestamp = moment().unix() * 1000

    const generateConfig = (method, requestPath, config) => {

        const GenerateHMAC = (value) => {
            return crypto.createHmac('sha256', secretKey)
                .update(value)
                .digest('hex')
                .replace('==','').replace('=','')
        }

        const genSign = () => {
            let value
            let queryString, body
            if (method === 'GET' && config.params) {
                queryString = Object.entries(config.params).map(e => e.join('=')).join('&')
            } else if (method === 'POST' && config.params) {
                body = JSON.stringify({ x: 5, y: 6 })
            }

            if (queryString) {
                value = timestamp + method.toUpperCase() + requestPath + '?' + queryString
            } else if(body) {
                let bodyString = JSON.stringify(body)
                const length = bodyString.length
                bodyString = bodyString.substring(1, length - 1)
                value = timestamp + method.toUpperCase() + requestPath + bodyString
            } else {
                value = timestamp + method.toUpperCase() + requestPath
            }

            const payload = GenerateHMAC(value)
            return Buffer.from(payload).toString('base64')
        }

        return {
            headers: {
                'ACCESS-KEY': 'bg_12529834cea0cd91fe37feb80a78f6f2',
                'ACCESS-PASSPHRASE': 'jihongkim',
                'ACCESS-TIMESTAMP': timestamp,
                'ACCESS-SIGN': genSign(),
                'Locale': 'en-US',
                'Content-Type': 'application/json'
            },
            timeout: 5000,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false, //허가되지 않은 인증을 reject하지 않겠다!
            })
        }
    }

    return {
        async get(url, config) {
            const conf = generateConfig('GET', url, config)

            let queryString
            if (config.params) {
                queryString = Object.entries(config.params).map(e => e.join('=')).join('&')
            }
            console.log(conf)
            return await axios.get(bitgetUrl + url + '?' + queryString, conf)
        },

        async post(url, data, config) {
            const conf = generateConfig('POST', url, config)
            return await axios.post(bitgetUrl + url, data, config)
        }
    }
})()

module.exports = $axios