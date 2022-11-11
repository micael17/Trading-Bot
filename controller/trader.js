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

    getAccountList = async () => { // 현재 계정의 자산 상태 확인 // 쓸일 있을 듯
        return await this.api.getAccountList()
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
        return await this.api.getOpenOrder({
            symbol: 'BTCUSDT_UMCBL'
        })
    }

    getAllOpenOrder = async () => {
        return await this.api.getAllOpenOrder()
    }

    getTraderOpenOrder = async() => {
        return await this.api.getTraderOpenOrder()
    }

    getAllPosition = async () => { // 모든 코인이 나오고 내 포지션 확인.  쓸일 있을 듯
        return await this.api.getAllPosition()
    }

    getSinglePosition = async () => { // 이걸 보통 쓸듯, 어차피 BTC만 할꺼니까
        return await this.api.getSinglePosition()
    }

    getOrderDetails = async() => {
        return await this.api.getOrderDetails()
    }

    getHistoryOrders = async() => {
        return await this.api.getHistoryOrders({
            startTime: this.startTime,
            endTime: this.endTime
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