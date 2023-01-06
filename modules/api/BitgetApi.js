const $axios = require('../plugins/axios')
const moment = require("moment");

class BitgetApi {
    constructor({
                apiKey = '',
                passphrase = '',
                secretKey = '',
                mainUrl = '',
                symbol = 'SETHSPERP_SCMCBL',
                granularity = '15m', // = period
                period = '15m',
                after= '',
                before = '',
                limit = '100'
    }) {
        this.apiKey = apiKey,
        this.passphrase = passphrase,
        this.secretKey = secretKey,
        this.mainUrl = mainUrl
        this.symbol = symbol
        this.granularity = granularity
        this.period = period
        this.after = after
        this.before = before
        this.limit = limit // Default 100
    }

    getStartTime() {
        return String(moment().subtract(23, 'hours').unix() * 1000)
    }

    getEndTime() {
        return String(moment().unix() * 1000)
    }

    /*openOrder = async ({

    }) => {
        const requestPath = '/api/mix/v1/account/accounts'
        return await $axios.post(requestPath, {
            params: {
                productType
            }
        })
    }*/

    placeOrder = async ({
            symbol = this.symbol,
            marginCoin = 'USDT',
            size = '0.001',
            price = '11111.0',
            side = 'open_long',
            orderType = 'limit',
        }) => {
        const requestPath = '/api/mix/v1/order/placeOrder'

        return await $axios.post(requestPath, {
            symbol,
            marginCoin,
            size,
            price,
            side,
            orderType
        })
    }

    closePosition = async ({ // =placeOrder api
           symbol = this.symbol,
           marginCoin = 'USDT',
           size = '0',
           price = '0',
           side = 'close_long',
           orderType = 'limit',
    }) => {
        const requestPath = '/api/mix/v1/order/placeOrder'

        return await $axios.post(requestPath, {
            symbol,
            marginCoin,
            size,
            price,
            side,
            orderType
        })
    }

    getAccountList = async(
            productType = 'umcbl',
        ) => {
        const requestPath = '/api/mix/v1/account/accounts'
        return await $axios.get(requestPath, {
            params: {
                productType
            }
        })
    }

    getCandleData = async (
        {
            symbol = this.symbol,
            granularity = this.granularity,
            startTime = this.getStartTime(),
            endTime = this.getEndTime()
        }) => {
        const requestPath = '/api/mix/v1/market/candles'
        return await $axios.get(requestPath, {
            params: {
                symbol, // Required
                granularity, // = period Required
                startTime,
                endTime
            }
        })
    }

    getSpotCandleData = async (
        {
           symbol = this.symbol,
           period = this.period,
           after = this.after,
           before= this.before,
           limit = this.limit
        }) => {
        return await $axios.get(this.url, {
            params: {
                symbol, // Required
                period, // Required
                after,
                before,
                limit
            }
        })
    }

    getOpenOrder = async (
        {
            symbol = this.symbol
        }) => {

        const requestPath = '/api/mix/v1/order/current'

        const res = await $axios.get(requestPath, {
            params: {
                symbol
            }
        })

        return res
    }

    getAllOpenOrder = async (
        productType = 'umcbl',
        marginCoin = 'USDT',
    ) => {
        const requestPath = '/api/mix/v1/order/marginCoinCurrent'

        const res = await $axios.get(requestPath, {
            params: {
                productType: 'umcbl',
                marginCoin
            }
        })

        return res
    }

    getTraderOpenOrder = async (
        symbol = this.symbol,
        productType = 'umcbl',
        pageSize = 20,
        pageNo = 1
    ) => {
        const requestPath = '/api/mix/v1/trace/currentTrack'

        const res = await $axios.get(requestPath, {
            params: {
                symbol,
                productType,
                pageSize,
                pageNo
            }
        })
        return res
    }

    getAllPosition = async (
        productType = 'umcbl'
    ) => {
        const requestPath = '/api/mix/v1/position/allPosition'

        const res = await $axios.get(requestPath, {
            params: {
                productType
            }
        })

        return res
    }

    getSinglePosition = async (
        symbol = this.symbol,
        marginCoin = 'USDT'
    ) => {
        const requestPath = '/api/mix/v1/position/singlePosition'

        const res = await $axios.get(requestPath, {
            params: {
                symbol,
                marginCoin
            }
        })

        return res
    }

    getOrderDetails = async (
        symbol = this.symbol,
        orderId = '',
        clientOid = ''
    ) => {
        const requestPath = '/api/mix/v1/order/detail'

        const res = await $axios.get(requestPath, {
            params: {
                symbol
            }
        })

        return res
    }

    getHistoryOrders = async ({
        symbol = this.symbol,
        startTime = this.getStartTime(),
        endTime = this.getEndTime(),
        pageSize = 20
    }) => {
        const requestPath = '/api/mix/v1/order/history'

        const res = await $axios.get(requestPath, {
            params: {
                symbol,
                startTime,
                endTime,
                pageSize
            }
        })

        return res
    }
}

module.exports = BitgetApi