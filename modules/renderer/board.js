
const board = document.getElementById('board')
let boardText = board.value
window.ipc.receive('msg:update', (payload) => {
    boardText = boardText + ' ' + payload
    board.innerText = boardText
})

    // const board = document.getElementById('board')
    // board.innerText = board.value + ' ' + `${api.Printer.do()}`

    /*const passphrase = localStorage.getItem('passphrase')

    if (true) {
        await window.algorithm.Doji.do()
    }*/

    /*const res = await window.api.bitget.getCandleData({
        endTime: String(moment().unix() * 1000),
        startTime: String(moment().subtract(23, 'hours').unix() * 1000)
    })*/

    /*if (res.status === 200) {
        const high = [], low = [], open = [], close = []
        const vol = []
        const time = []

        res.data.forEach((v) => {
            time.push(moment(Number(v[0])).format("YYYY-MM-DD HH:mm:ss"))
            open.push(v[1])
            high.push(v[2])
            low.push(v[3])
            close.push(v[4])
            vol.push(v[5])
        })

        console.log(time)

        c3.generate({
            bindto: '#lineChart',
            data: {
                x: 'x',
                xFormat: '%Y-%m-%d %H:%M:%S',
                columns: [
                    ['x'].concat(time),
                    ['data1'].concat(close)
                ]
            },
            axis: {
                x : {
                    type: 'timeseries',
                    tick: {
                        format: '%H:%M:%S'
                    }
                }
            }
        });

        c3.generate({
            bindto: '#volumeChart',
            data: {
                x: 'x',
                xFormat: '%Y-%m-%d %H:%M:%S',
                type: 'bar',
                columns: [
                    ['x'].concat(time),
                    vol
                ]
            },
            axis: {
                x : {
                    type: 'timeseries',
                    tick: {
                        format: '%H:%M:%S'
                    }
                }
            }
        });
    }*/