const fs = require('fs')
const Doji = require('../modules/algorithm/Doji')
const Trader = require('./trader')
const Algorithm = require('../modules/algorithm/Algorithm')
const BitgetApi = require('../modules/api/BitgetApi')
const moment = require('moment')

class Main {
    constructor({
        msgFn = (channel, msg) => {}
        }) {
        this.msgFn = msgFn
    }

    interval = async (passphrase) => {
        const account = JSON.parse(fs.readFileSync('./preference/account.json'))
        const doji = new Doji()
        const trader = new Trader({
            algorithmObj: doji,
            mainUrl: account.mainUrl,
            apiKey: account.apiKey,
            secretKey: account.secretKey,
            passphrase
        })
        const algo = new Algorithm()
        const api = new BitgetApi({})
        const second = 1000

        const interval = setInterval(async () => {
            try {
                const res = await api.getCandleData({})
                if (res.status === 200) {
                    const data = res.data
                    const order = algo.meanReversion1(data)

                    this.msgFn('msg:update', JSON.stringify(moment().format('YYYY-MM-DD hh:mm:ss')))
                    if (order && order.direction && order.price) {
                        const res = await api.placeOrder({
                            size: '0.001',
                            price: String(order.price),
                            side: 'open_' + order.direction
                        })

                        this.msgFn('msg:update', 'CHECK!!!!NOW!!!!!!!')
                        clearInterval(interval)
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }, second * 10)


        // const minute = second * 60

        /*const res = await trader.getTraderOpenOrder()

        win.webContents.send('msg:update', JSON.stringify(res.data))*/

        // await trader.getTraderOpenOrder();

        // res.data && res.data.length > 0 then foreach i get Number(unrealizedPL > 0) closePosition

        /*const interval = setInterval(async () => {
            await trader.tmp(async (channel, payload) => {
                console.log(payload.data[0].unrealizedPL)
                if (Number(payload.data[0].unrealizedPL) > 10) {
                    const size = payload.data[0].total
                    const price = payload.data[0].marketPrice

                    const res = await trader.placeOrder({
                        size,
                        price,
                        side: 'close_long'
                    })

                    console.log(res.data)
                    win.WebContents.send('msg:update', JSON.stringify(res.data))

                    clearInterval(interval)
                }
            })
        }, second * 5)*/
    }

    run = () => {
        this.interval().then(() => {

        })
    }
}

module.exports = Main