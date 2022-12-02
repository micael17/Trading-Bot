const fs = require('fs')
const Doji = require('../modules/algorithm/Doji')
const Trader = require('./trader')
const Algorithm = require('../modules/algorithm/Algorithm')
const BitgetApi = require('../modules/api/BitgetApi')
const moment = require('moment')

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

    openInterval = async () => {
        const second = 1000
        const interval = setInterval(async () => {
            try {
                const res = await this.api.getCandleData({})
                if (res.status === 200) {
                    const data = res.data
                    const order = this.algo.meanReversion1(data)

                    this.msgFn('msg:update', JSON.stringify(moment().format('YYYY-MM-DD hh:mm:ss')))
                    if (order && order.direction && order.price) {
                        const res = await this.api.placeOrder({
                            size: '0.001',
                            price: String(order.price),
                            side: 'open_' + order.direction
                        })

                        if (res.status === 200) {
                            /*this.closeInterval({
                                price: String(order.price),
                                size: '0.001',
                                side: 'close_' + order.direction
                            })*/
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

    closeInterval = ({
                         price,
                         size = '0.001',
                         side
                     }) => {
        const interval = setInterval(async () => {
            try {
                const res = await this.api.getCandleData({})
                if (res.status === 200 && res.data.code === '00000') {
                    const data = res.data
                    const order = this.algo.meanReversion1(data)

                    this.msgFn('msg:update', JSON.stringify(moment().format('YYYY-MM-DD hh:mm:ss')))
                    if (order && order.direction && order.price) {
                        const res = await this.api.placeOrder({
                            size: '0.001',
                            price: String(price),
                            side: 'open_' + side
                        })

                        if (res.status === 200 && res.data.code === '00000') {
                            this.closeInterval({
                                price: String(order.price),
                                size: '0.001',
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