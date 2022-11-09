const axios = require('axios')

module.exports = axios.create({
    headers: {
        'Locale': 'en-US',
        'Content-Type': 'application/json'
    },
    timeout: 5000,
})