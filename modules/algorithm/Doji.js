const BitgetApi = require('../api/BitgetApi');
const moment = require('moment')

class Doji {
    constructor() {
        this.endTime = String(moment().unix() * 1000)
        this.startTime = String(moment().subtract(23, 'hours').unix() * 1000)
    }

    do = async () => {
        console.log('test')
        const bitget = new BitgetApi()
        const res = await bitget.getCandleData({
            endTime: this.endTime,
            startTime: this.startTime
        })

        if (res.status === 200) {
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
                const pre1 = close[length - 2] - close[length - 1] > 0
                const pre2 = close[length - 3] - close[length - 2] > 0
                const pre3 = close[length - 4] - close[length - 3] > 0

                console.log(pre1, pre2, pre3)
            }

        } else {
            alert('http status is false')
            return false
        }
    }
}

module.exports = Doji