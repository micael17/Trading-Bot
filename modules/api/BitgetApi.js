const $axios = require('../plugins/axios')

class BitgetApi {
    constructor({
                apiKey = '',
                passphrase = '',
                secretKey = '',
                mainUrl = '',
                symbol = 'BTCUSDT_UMCBL',
                granularity = '15m', // = period
                startTime = '',
                endTime= '',
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
        this.startTime = startTime
        this.endTime = endTime
        this.period = period
        this.after = after
        this.before = before
        this.limit = limit // Default 100
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
            startTime = this.startTime,
            endTime = this.endTime
        }) => {
        const requestPath = '/api/mix/v1/market/candles'
        return await $axios.get(requestPath, {
            params: {
                symbol, // Required
                granularity, // Required
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
        symbol = 'BTCUSDT_UMCBL',
        productType = 'umcbl',
        pageSize = 1,
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
        symbol = 'BTCUSDT_UMCBL',
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
        symbol = 'BTCUSDT_UMCBL',
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
        symbol = 'BTCUSDT_UMCBL',
        startTime = this.startTime,
        endTime = this.endTime,
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