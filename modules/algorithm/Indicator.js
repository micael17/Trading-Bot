const _ = require('lodash')

function fastStochastic(candleData = {
    high: [],
    low: [],
    open: [],
    close: [],
    vol: [],
    time: [],
    length: 0
}) {
    // Fast %K = {(현재가 - N기간 중 최저가) / (N기간 중 최고가 - N기간 중 최저가)} * 100
    // Fast %D = Fast %K
    const { high, low, open, close, vol, time, length } = candleData
    const idx = length - 1
    const lastCandleIdx = idx - 1
    const lowVal = _.min(low)
    const highVal = _.max(high)
    const nowVal = close[lastCandleIdx]

    const HIGH = 80
    const LOW = 20

    const K = Math.floor(((nowVal - lowVal) / (highVal - lowVal)) * 100)
    if (K >= HIGH || K <=LOW) {
        console.log('Fast Stochastic: ' + K)
        return true
    } else {
        return false
    }
}

function slowStochastic(candleData = {
    high: [],
    low: [],
    open: [],
    close: [],
    vol: [],
    time: [],
    length: 0
}){
    const { high, low, open, close, vol, time, length } = candleData
}

module.exports = {
    fastStochastic
}