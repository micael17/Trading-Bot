const { contextBridge, ipcRenderer } = require('electron')

import axios from './preload/axios'

contextBridge.exposeInMainWorld('http', {
    get: (params) => axios.get(params),
    post: (params) => axios.post(params)
})