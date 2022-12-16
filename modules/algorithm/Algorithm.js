class Algorithm {
    constructor() {
    }

    getAvg(values = []) {
        let avg = 0
        if (values.length < 0) return

        try {
            values.forEach((v) => {
                avg += Number(v)
            })
            avg = avg / values.length
        } catch (e) {
            console.log('[ERROR] getAvg : ' + avg)
            return false
        }

        return avg
    }

    getOrder(curDirection, idx, price, targetPrice, stopLossPrice) {
        let direction = false
        const openPrice = price[idx - 1]

        if (curDirection === 'short') {
            direction = 'long'
        } else if(curDirection === 'long') {
            direction = 'short'
        }

        console.log('open price : ' + openPrice)
        return {
            direction,
            openPrice,
            targetPrice,
            stopLossPrice
        }
    }

    /**
     * 역추세매매 전략 1 (쏟아지는 봉)
     * : 마지막 캔들의 상승/하락이 크게 나오면서 거래량이 압도적일 때 역 추세로 매매하는 전략.
     *
     * 조건
     * 1) 1, 2번(마지막) 캔들 방향이 같음
     * 2) 마지막 캔들의 몸통 길이가 평균 캔들 몸통 길이의 2배 이상
     * 3) 마지막 캔들의 거래량이 평균거래량의 3배 이상 (가장 중요)
     *
     * ps. 장세가 기본적으로 거래량이 충분하고 변동성이 좋을 때 사용한다.
     * 상승/하락장은 크게는 상관없지만 하락장에서 더 좋을 듯.
     */
    meanReversion1(candleData = {
        high: [],
        low: [],
        open: [],
        close: [],
        vol: [],
        time: [],
        length: 0
    }) {
        const { high, low, open, close, vol, time, length } = candleData
        if (open.length === close.length && close[length - 1]) {
            const idx = length - 1 //현재 캔들 idx
            const lastCandleIdx = idx - 1 //직전 캔들 idx
            const pre2 = close[lastCandleIdx - 1] - close[lastCandleIdx] < 0 ? 'long' : 'short'
            const pre1 = close[lastCandleIdx - 2] - close[lastCandleIdx - 1] < 0 ? 'long' : 'short'

            //1) 1, 2번(마지막) 캔들 방향이 같음
            if (pre1 === pre2) {
                const diversion = []
                for (let i = 0; i < open.length; i+= 1) {
                    diversion.push(Math.abs(open[i] - close[i]))
                }
                const avgCandleDiversion = this.getAvg(diversion) // 평균 캔들 몸통 길이 구하기
                const lastCandleDiversion = Math.abs(open[lastCandleIdx] - close[lastCandleIdx]) // 마지막 캔들의 몸통 길이 구하기

                console.log("2. ", lastCandleDiversion > avgCandleDiversion * 2, lastCandleDiversion, avgCandleDiversion)
                // 2) 2번(마지막) 캔들의 몸통 길이가 평균 캔들 몸통 길이의 2배 이상
                if (lastCandleDiversion > avgCandleDiversion * 2) {
                    const lastVol = vol[lastCandleIdx]
                    const avgVol = this.getAvg(vol)

                    console.log("3. ", lastVol > avgVol * 3, lastVol, avgVol)
                    //3) 마지막 캔들의 거래량이 평균거래량의 3배 이상 (가장 중요)
                    if (lastVol > avgVol * 3) {
                        return true
                    }
                }
            }
        } else {
            console.log('[ERROR] meanReversion1 length')
        }
        return false
    }

    /**
     * 역추세매매 전략 2 (쏟아지는 3봉)
     * : 3개 캔들의 거래량이 많아지면서 방향이 같고 상승/하락이 크게 나올 때 역 추세로 매매하는 전략
     * 장세가 기본적으로 거래량이 충분하고 변동성이 좋을 때 사용한다.
     * 상승/하락장은 크게는 상관없지만 하락장에서 더 좋을 듯.
     *
     * 익절 : 3개 캔들의 평균값
     * 손절 : 마지막 봉에서 3개 캔들의 평균값을 +/- 한 값
     *
     * ps. 기본적으로 현재 봉의 이전 봉이 기준이다. 이전 봉을 보고 판단하여 현재 봉에서 포지션 오픈
     */
    async meanReversion2(candleData = {
        high: [],
        low: [],
        open: [],
        close: [],
        vol: [],
        time: [],
        length: 0
    }) {
        const { high, low, open, close, vol, time, length } = candleData
        if (length > 10 && close[length - 1]) {
            const idx = length - 1
            const pre1 = close[idx - 2] - close[idx - 1] < 0 ? 'long' : 'short'
            const pre2 = close[idx - 3] - close[idx - 2] < 0 ? 'long' : 'short'
            const pre3 = close[idx - 4] - close[idx - 3] < 0 ? 'long' : 'short'
            let curDirection;

            console.log(pre1, pre2, pre3, close[idx - 1])
            if (pre1 === pre2 && pre2 === pre3) { //세 캔들 방향이 모두 같다면
                curDirection = pre1 // 세 캔들의 방향을 구한다.
                const vol1 = vol[idx - 2] < vol[idx - 1]
                const vol2 = vol[idx - 3] < vol[idx - 2]
                console.log(vol1 , vol2 , vol[idx - 1] > this.getAvg(vol) )

                if ( vol1 && vol2 && vol[idx - 1] > this.getAvg(vol) ) { // 볼륨이 점점 늘고, 마지막봉이 평균 볼륨보다 클 때
                    const price1 = Math.abs(open[idx - 2] - close[idx - 2])
                    const price2 = Math.abs(open[idx - 3] - close[idx - 3])
                    const price3 = Math.abs(open[idx - 4] - close[idx - 4])

                    if (price1 > price2 && price2 > price3) { // 상승 or 하락이 크게 나오는가?

                        const targetPrice = this.getAvg
                        let stopLossPrice
                        if (curDirection === 'long') {
                            stopLossPrice = close[idx - 1] + Math.abs(close[idx - 1] - targetPrice)
                        } else {
                            stopLossPrice = close[idx - 1] - Math.abs(close[idx - 1] - targetPrice)
                        }

                        return this.getOrder(curDirection, idx, close, targetPrice, stopLossPrice)
                    }
                }
            }
        } else {
            console.log('[ERROR] meanReversion2 length')
        }
        return false
    }


    /**
     * 역추세매매 전략 (도지)
     * : 직전(2번) 캔들이 도지 캔들이고 거래량이 압도적으로 클 때 역추세매매 하는 전략
     *
     * 조건
     * 1) 2번 캔들 도지
     * 2) 2번 캔들의 거래량이 평균 거래량의 3배 이상
     */
    doji(candleData = {
        high: [],
        low: [],
        open: [],
        close: [],
        vol: [],
        time: [],
        length: 0
    }) {
        const { high, low, open, close, vol, time, length } = candleData
        if (open.length === close.length && close[length - 1]) {
            const idx = length - 1 //현재 캔들의 idx
            const lastCandleIdx = idx - 1 //직전 캔들 idx
            const lastCandleDiversion = Math.abs(open[lastCandleIdx] - close[lastCandleIdx])

            //1) 직전 캔들이 도지인가?
            console.log('doji) -lastCandleDiversion: ', lastCandleDiversion)
            if (lastCandleDiversion < 5) {
                // 2) 직전 캔들의 거래량이 평균 거래량의 3배 이상
                if (vol[lastCandleIdx] > this.getAvg(vol) * 3) {
                    return true
                }
            }
        }
        return false
    }
}

module.exports = Algorithm