const _ = require('lodash')

function getAvg(values = []) {
    let avg = 0
    if (values.length < 0) return

    try {
        values.forEach((v) => {
            avg += Number(v)
        })
        avg = avg / values.length
    } catch (e) {
        console.log('[ERROR] indicator getAvg : ' + avg)
        return false
    }

    return avg
}

function rsi(candleData = {
    high: [],
    low: [],
    open: [],
    close: [],
    vol: [],
    time: [],
    length: 0
}) {
    /**
     * 주어진 기간의 모든 날의 주가에 대해서
     1. 가격이 전일 가격보다 상승한 날의 상승분을 U(up) 값이라고 하고, 하락한 날의 하락분은 D(down) 값이라고 한다.
     2. U와 D의 평균값을 각각 AU(average ups), AD(average downs)이라고 한다.
     3. AU를 AD로 나눈 값을 RS(relative strength) 값이라고 한다. RS가 크다는 것은 일정 기간 동안 하락한 폭보다 상승한 폭이 더 크다는 것을 의미한다.
     4. RSI = RS / (1 + RS)을 통해서 RSI를 구한다. 보통 RSI는 백분율로 나타내므로 최종적으로 식에 100을 곱해준다.
     */
    const { high, low, open, close, vol, time, length } = candleData
    const idx = length - 1
    const lastCandleIdx = idx - 1
    const HIGH = 75
    const LOW = 25
    let U = 0, D = 0
    const period = 14

    for (let i = idx - period; i < idx; i += 1) { // 지난 봉 기준으로
        const diff = close[i] - close[i - 1]
        if (diff >= 0) {
            U += diff
        } else {
            D -= diff
        }
    }

    const RS = U / D
    const RSI = Math.floor((RS / (1 + RS)) * 100)
    if (RSI >= HIGH || RSI <= LOW) {
        return RSI
    } else {
        return false
    }
}

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
    // Fast %D = Fast %K...?
    const { high, low, open, close, vol, time, length } = candleData
    const idx = length - 1
    const lastCandleIdx = idx - 1
    const customLength = 20
    const newHigh = [], newLow = []

    for (let i = customLength; i >= 0; i -= 1) {
        newHigh.push(high[lastCandleIdx - i])
        newLow.push(low[lastCandleIdx - i])
    }

    const lowVal = _.min(newLow)
    const highVal = _.max(newHigh)
    const nowVal = close[lastCandleIdx]

    const HIGH = 75
    const LOW = 26

    const K = Math.floor(((nowVal - lowVal) / (highVal - lowVal)) * 100)
    if (K >= HIGH || K <=LOW) {
        return K
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
    fastStochastic,
    rsi
}