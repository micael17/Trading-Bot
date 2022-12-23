const fs = require('fs')
const Doji = require('../modules/algorithm/Doji')
const Trader = require('./trader')
const Algorithm = require('../modules/algorithm/Algorithm')
const BitgetApi = require('../modules/api/BitgetApi')
const Indicator = require('../modules/algorithm/Indicator')
const moment = require('moment')
const TelegramAPI = require('../modules/api/Telegram')

class Main {
    constructor({
        msgFn = (channel, msg) => {},
        passphrase = ''
        }) {

        this.account = JSON.parse(fs.readFileSync('./preference/account.json'))
        this.api = new BitgetApi({
            mainUrl: this.account.mainUrl,
            apiKey: this.account.apiKey,
            secretKey: this.account.secretKey,
            passphrase: passphrase && passphrase.length > 0 ? passphrase : this.account.passphrase
        })
        this.algo = new Algorithm()
        this.msgFn = msgFn
    }

    getCandleDataFromRawData = (data) => {
        const high = [], low = [], open = [], close = []
        const vol = []
        const time = []
        const length = data.length

        data.forEach((d) => {
            time.push(moment(Number(d[0])).format("YYYY-MM-DD HH:mm:ss"))
            high.push(Number(d[2])) //고가
            open.push(Number(d[1])) //시가
            close.push(Number(d[4])) //종가
            low.push(Number(d[3])) //저가
            vol.push(Number(d[5]))
        })

        return {
            high, low, open, close, vol, time, length
        }
    }

    openInterval = async () => {
        const second = 1000
        let isNotited = [false, false, false]
        const interval = setInterval(async () => {
            try {
                const res = await this.api.getCandleData({})
                if (res.status === 200) {
                    const candleData = this.getCandleDataFromRawData(res.data)

                    const stochasticResult = Indicator.fastStochastic(candleData)
                    const order = this.algo.meanReversion1(candleData) || this.algo.doji(candleData)

                    if (order && isNotited.indexOf(false) > -1) {
                        const idx = isNotited.indexOf(false)
                        if (idx > -1) {
                            isNotited[idx] = true
                        }

                        TelegramAPI.sendMessage("CHECK NOW. FastStochastic: " + stochasticResult)
                        this.msgFn('msg:update', JSON.stringify(moment().format('YYYY-MM-DD hh:mm:ss')))
                    } else if(!order) {
                        isNotited = [false, false, false]
                    }

                    /*if (order && order.direction && order.price && order.targetPrice && order.stopLossPrice) {
                        const res = await this.api.placeOrder({
                            size: '0.004',
                            price: String(order.price),
                            side: 'open_' + order.direction,
                            presetTakeProfitPrice: order.targetPrice,
                            presetStopLossPrice: order.stopLossPrice
                        })

                        if (res.status === 200) {
                            /!*this.closeInterval({
                                price: String(order.price),
                                size: '0.004',
                                side: 'close_' + order.direction
                            })*!/

                            clearInterval(interval)
                        }

                        TelegramAPI.sendMessage("CHECK NOW")
                        // this.msgFn('msg:update', 'CHECK!!!!NOW!!!!!!!')
                    }*/
                }
            } catch (e) {
                console.log(e)
            }
        }, second * 2)
    }

    closeInterval = ({
                         price,
                         size = '0.001',
                         side
                     }) => {
        const second = 1000
        const interval = setInterval(async () => {
            try {
                const res = await this.api.getCandleData({})
                if (res.status === 200 && res.data.code === '00000') {
                    const data = res.data
                    const order = this.algo.meanReversion1(data)

                    this.msgFn('msg:update', JSON.stringify(moment().format('YYYY-MM-DD hh:mm:ss')))
                    if (order && order.direction && order.price) {
                        const res = await this.api.placeOrder({
                            size: '0.004',
                            price: String(price),
                            side: 'open_' + side
                        })

                        if (res.status === 200 && res.data.code === '00000') {
                            this.closeInterval({
                                price: String(order.price),
                                size,
                                side: 'close_' + order.direction
                            })
                        }

                        this.msgFn('msg:update', 'CHECK!!!!NOW!!!!!!!')
                        clearInterval(interval)
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }, second * 10)

    }

    run = () => {
        this.openInterval().then(() => {

        })
    }
}

module.exports = Main