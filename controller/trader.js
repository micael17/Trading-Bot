const BitgetApi = require('../modules/api/BitgetApi')
const moment = require('moment')

class Trader {
    constructor({
        algorithmObj = {},
        mainUrl = '',
        apiKey = '',
        passphrase = '',
        secretKey = '',
    }) {
        this.algorithmObj = algorithmObj
        this.endTime = String(moment().unix() * 1000)
        this.startTime = String(moment().subtract(23, 'hours').unix() * 1000)
        this.mainUrl = mainUrl
        this.apiKey = apiKey
        this.secretKey = secretKey
        this.passphrase = passphrase

        this.api = new BitgetApi({
            mainUrl: this.mainUrl,
            apiKey: this.apiKey,
            secretKey : this.secretKey,
            passphrase : this.passphrase
        })
    }

    getData = async () => {
        const res = await this.api.getCandleData({
            symbol: 'BTCUSDT_UMCBL',
            granularity : '15m',
            endTime: this.endTime,
            startTime: this.startTime
        })

        return res;
    }

    getOpenOrder = async () => {
        console.log('trader')
        return await this.api.getOpenOrder({
            symbol: 'BTCUSDT_UMCBL'
        })
    }

    async main(win) {
        if (win) {
            const res = await this.getData()
            console.log(res.status)
            if (res.status === 200) {
                console.log(this.algorithmObj)

                win.webContents.send('msg:update', res.status)
                const result = await this.algorithmObj.candleDo(res.data)


                if (result) {
                    console.log(result)
                    win.webContents.send('msg:update', result)
                }
            }
        }
    }
}

module.exports = Trader