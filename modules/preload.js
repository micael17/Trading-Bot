const { contextBridge, ipcRenderer } = require('electron')
const axios = require('./plugins/axios')
const BitgetApi = require('./api/BitgetApi')
const Doji = require('./algorithm/Doji')

const validChannels = [
    'msg:update',
    'msg:httpStatus',
    'msg:tradeStatus'
]


contextBridge.exposeInMainWorld('axios', {
    get: axios.get,
    post: axios.post
    // doThing: () => ipcRenderer.send('do-a-thing')
    // 그러면 html에서는 window.axios.doThing() 로 접근가능
})

contextBridge.exposeInMainWorld('ipc', {
    send: (channel, payload) => { // From render to main
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, payload)
        }
    },
    receive: (channel, listener) => { // From main to render
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (evt, payload) => listener(payload))
        }
    }
})

contextBridge.exposeInMainWorld('api', {
    sendPassphrase: (payload) => ipcRenderer.send('onInputPassphrase', payload)
})

contextBridge.exposeInMainWorld('algorithm', {
    Doji: new Doji()
})
