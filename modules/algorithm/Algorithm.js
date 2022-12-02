const moment = require("moment");

class Algorithm {
    constructor() {
    }

    getAvgVolume(data = []) {
        let avg = 0
        if (data.length < 0) return

        try {
            data.forEach((d) => {
                avg += Number(d[5])
            })
            avg = avg / data.length
        } catch (e) {
            console.log('[ERROR] getAvgVolume : ' + avg)
            return false
        }

        return avg
    }

    /**
     * 역추세매매 전략 1 (쏟아지는 3봉)
     * : 3개 캔들의 거래량이 많아지면서 방향이 같고 상승/하락이 크게 나올 때 역 추세로 매매하는 전략
     * 장세가 기본적으로 거래량이 충분하고 변동성이 좋을 때 사용한다.
     * 상승/하락장은 크게는 상관없지만 하락장에서 더 좋을 듯.
     *
     * ps. 기본적으로 현재 봉의 이전 봉이 기준이다. 이전 봉을 보고 판단하여 현재 봉에서 포지션 오픈
     */
    meanReversion1(data = []) {
        /**
         * 100개 봉 평균 볼륨 구하기 (캔들차트 get하면 기본이 100개임)
         */

        if (!data || data.length < 1) return false

        const high = [], low = [], open = [], close = []
        const vol = []
        const time = []
        let length

        data.forEach((d) => {
            time.push(moment(Number(d[0])).format("YYYY-MM-DD HH:mm:ss"))
            high.push(Number(d[2])) //고가
            open.push(Number(d[1])) //시가
            close.push(Number(d[4])) //종가
            low.push(Number(d[3])) //저가
            vol.push(Number(d[5]))
        })

        length = data.length
        console.log('0. close.length: ', close[length - 1])

        if (close.length > 10 && close[length - 1]) { // 이전 캔들이 롱인가 숏인가?
            const idx = length - 1
            const pre1 = close[idx - 2] - close[idx - 1] < 0 ? 'long' : 'short'
            const pre2 = close[idx - 3] - close[idx - 2] < 0 ? 'long' : 'short'
            const pre3 = close[idx - 4] - close[idx - 3] < 0 ? 'long' : 'short'
            let curDirection;

            if (pre1 === pre2 && pre2 === pre3) { //세 캔들 방향이 모두 같다면
                curDirection = pre1 // 세 캔들의 방향을 구한다.
                console.log('1. direction :', curDirection)

                const vol1 = vol[idx - 2] < vol[idx - 1]
                const vol2 = vol[idx - 3] < vol[idx - 2]

                if ( vol1 && vol2 && vol[idx - 1] > this.getAvgVolume(data) ) { // 볼륨이 점점 늘고, 마지막봉이 평균 볼륨보다 클 때
                    console.log('2. volume : ' + this.getAvgVolume(data))
                    //상승/하락이 크게 나오는가?
                    const price1 = Math.abs(open[idx - 2] - close[idx - 2])
                    const price2 = Math.abs(open[idx - 3] - close[idx - 3])
                    const price3 = Math.abs(open[idx - 4] - close[idx - 4])

                    if (price1 > price2 && price2 > price3) {
                        const openPrice = open[idx]
                        let openDirection = false

                        if (curDirection === 'short') {
                            openDirection = 'long'
                        } else if(curDirection === 'long') {
                            openDirection = 'short'
                        }

                        console.log('3. open price : ' + openPrice)

                        return {
                            direction: openDirection,
                            price: openPrice
                        }
                    }
                }
            }
        }
    }

    /**
     * 역추세매매 전략 2 (도지)
     * : 직전 봉이 도지이고 그 전 봉에서 큰 거래량으로 상승/하락을 크게 했을 경우 역매매 하는 전략
     */
    doji() {

    }


}

module.exports = Algorithm