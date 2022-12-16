const axios = require('axios')
const https = require('https')

const Telegram = ( function () {
    return {
        sendMessage(text) {
            let url = 'https://api.telegram.org/bot5980250815:AAGgrQ1lbEDSF4NQlKrV4Qnntm6zXQOiudw/sendMessage?chat_id=5061882495'
            url = url + '&text=' + text
            axios.get(url, {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            }).then(r => {})
        }
    }
})()

module.exports = Telegram