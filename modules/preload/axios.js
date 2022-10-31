import axios from 'axios'

const config = {
    headers: {
        'Locale': 'en-US',
        'Content-Type': 'application/json'
    },
    timeout: 5000,
}

export default axios(config)