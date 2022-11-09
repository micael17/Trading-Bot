const axios = require('../plugins/axios')

class BitgetApi {
    constructor(symbol = 'BTCUSDT_UMCBL',
                granularity = '1H', // = period
                startTime = '',
                endTime= '',
                period = '1h',
                after= '',
                before = '',
                limit = '100') {
        this.symbol = symbol
        this.granularity = granularity
        this.startTime = startTime
        this.endTime = endTime
        this.period = period
        this.after = after
        this.before = before
        this.limit = limit // Default 100
        this.url = 'https://api.bitget.com/api/mix/v1/market/candles'
    }

    getCandleData = async (
        {
            symbol = this.symbol,
            granularity = this.granularity,
            startTime = this.startTime,
            endTime = this.endTime
        }) => {
        return await axios.get(this.url, {
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
        return await axios.get(this.url, {
            params: {
                symbol, // Required
                period, // Required
                after,
                before,
                limit
            }
        })
    }


}

module.exports = BitgetApi