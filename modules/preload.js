const { contextBridge, ipcRenderer } = require('electron')
const axios = require('./plugins/axios')
const BitgetApi = require('./api/BitgetApi')
const Doji = require('./algorithm/Doji')
const moment = require('moment')

contextBridge.exposeInMainWorld('axios', {
    get: axios.get,
    post: axios.post
    // doThing: () => ipcRenderer.send('do-a-thing')
    // 그러면 html에서는 window.axios.doThing() 로 접근가능
})

contextBridge.exposeInMainWorld('api', {
    moment: moment,
    bitget: new BitgetApi()
})

contextBridge.exposeInMainWorld('algorithm', {
    Doji: new Doji()
})