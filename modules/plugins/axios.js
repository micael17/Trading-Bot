const axios = require('axios')
const https = require('https')
const moment = require('moment')
const crypto = require('crypto')

const $axios = ( function () {

    const secretKey = '02bb10a98085573bf679ae939a78216f61824f90d47af176e76c49dd88bc64b6'
    const bitgetUrl = 'https://api.bitget.com'



    const generateConfig = (method, requestPath, config) => {

        const timestamp = moment().unix() * 1000

        const genSign = () => {
            let value
            let queryString, bodyString = ''
            if (method === 'GET' && config.params) {
                queryString = Object.entries(config.params).map(e => e.join('=')).join('&')
            } else if (method === 'POST' && config.params) {
                bodyString = JSON.stringify({ x: 5, y: 6 })
            }

            if (queryString) {
                value = timestamp + method.toUpperCase() + requestPath + '?' + queryString + bodyString
            } else {
                const length = bodyString.length
                bodyString = bodyString.substring(1, length - 1)
                value = timestamp + method.toUpperCase() + requestPath + bodyString
            }

            return crypto.createHmac('sha256', secretKey)
                .update(value)
                .digest('base64')
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


   function errorHandler(error) {
        {
            if (error.response) {
                console.log(error.response.data)
            } else if (error.request) {
                console.log(error.request)
            } else {
                console.log('Error', error.message)
            }
        }
    }

    return {
        async get(url, config) {
            const genConfig = generateConfig('GET', url, config)

            let queryString
            if (config.params) {
                queryString = Object.entries(config.params).map(e => e.join('=')).join('&')
            }

            console.log(queryString)
            return await axios.get(bitgetUrl + url + '?' + queryString, genConfig)
                .catch(function(error) { errorHandler(error) })
        },

        async post(url, data, config) {
            const genConfig = generateConfig('POST', url, config)

            let queryString
            if (config.params) {
                queryString = Object.entries(config.params).map(e => e.join('=')).join('&')
            }

            return await axios.post(bitgetUrl + url + '?' + queryString, data, genConfig)
                .catch(function(error) { errorHandler(error) })
        },
    }
})()

module.exports = $axios