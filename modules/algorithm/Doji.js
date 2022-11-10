const BitgetApi = require('../api/BitgetApi');
const moment = require('moment')

class Doji {

    constructor() {
        this.endTime = String(moment().unix() * 1000)
        this.startTime = String(moment().subtract(23, 'hours').unix() * 1000)
    }

    getData = async () => {
        const bitget = new BitgetApi()
        const res = await bitget.getCandleData({
            endTime: this.endTime,
            startTime: this.startTime
        })

        return res;
    }

    candleDo = async (data = []) => {
        if (!data || data.length < 1) return false

        const high = [], low = [], open = [], close = []
        const vol = []
        const time = []
        let length

        data.forEach((v) => {
            time.push(moment(Number(v[0])).format("YYYY-MM-DD HH:mm:ss"))
            open.push(v[1])
            high.push(v[2])
            low.push(v[3])
            close.push(v[4])
            vol.push(v[5])
        })

        length = data.length

        if (close.length > 10 && close[length - 1]) { // 이전 캔들이 롱인가 숏인가?
            const idx = length - 1
            const pre1 = close[idx - 1] - close[idx] < 0 ? 'long' : 'short'
            const pre2 = close[idx - 2] - close[idx - 1] < 0 ? 'long' : 'short'
            const pre3 = close[idx - 3] - close[idx - 2] < 0 ? 'long' : 'short'
            let curDirection;

            if (pre1 === pre2 === pre3) { //세 캔들 방향이 모두 같다면
                curDirection = pre1 // 방향을 구한다.

                const vol1 = vol[idx - 1] > vol[idx]
                const vol2 = vol[idx - 2] > vol[idx - 1]
                const vol3 = vol[idx - 3] > vol[idx - 2]
                // volume이 줄어드는가?
                console.log(vol1, vol2, vol3)

                if (vol1 && vol2 && vol3) {
                    //역추세 매매 실행
                    // doTrade(추세매매 or 역매매, curDirection)

                    return true
                }
            }
        }
    }

    do = async () => {
        const bitget = new BitgetApi()
        const res = await bitget.getCandleData({
            endTime: this.endTime,
            startTime: this.startTime
        })

        if (res.status === 200) {
            console.log('http OK')
            const high = [], low = [], open = [], close = []
            const vol = []
            const time = []
            let length

            res.data.forEach((v) => {
                time.push(moment(Number(v[0])).format("YYYY-MM-DD HH:mm:ss"))
                open.push(v[1])
                high.push(v[2])
                low.push(v[3])
                close.push(v[4])
                vol.push(v[5])
            })

            length = res.data.length

            if (close.length > 10 && close[length - 1]) { // 이전 캔들이 롱인가 숏인가?
                const idx = length - 1
                const pre1 = close[idx - 1] - close[idx] < 0 ? 'long' : 'short'
                const pre2 = close[idx - 2] - close[idx - 1] < 0 ? 'long' : 'short'
                const pre3 = close[idx - 3] - close[idx - 2] < 0 ? 'long' : 'short'
                let curDirection;

                if (pre1 === pre2 === pre3) { //세 캔들 방향이 모두 같다면
                    curDirection = pre1 // 방향을 구한다.

                    const vol1 = vol[idx - 1] > vol[idx]
                    const vol2 = vol[idx - 2] > vol[idx - 1]
                    const vol3 = vol[idx - 3] > vol[idx - 2]
                    // volume이 줄어드는가?
                    console.log(vol1, vol2, vol3)

                    if (vol1 && vol2 && vol3) {
                        //역추세 매매 실행
                        // doTrade(추세매매 or 역매매, curDirection)
                        return true
                    }

                }
            }

        } else {
            alert('http status is false')
            return 'http false'
        }
    }
}

module.exports = Doji