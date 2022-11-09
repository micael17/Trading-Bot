const { app, BrowserWindow, ipcMain } = require('electron')
const main = require('./modules/main')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, './modules/preload.js'),
            nodeIntegration: true
        },
    });

    //ipcMain.handle('ping', () => 'pong')
    //win.loadURL('https://biskitanalytics.smiledev.net/myDashboard/home/serviceReview?projectId=A0018&countryCd=CHN')
    win.loadFile('./html/login.html')
};

app.whenReady().then(() => {
    createWindow()

    // let passphrase = null

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    ipcMain.on('onMain', (evt, payload) => {

    })

    /*ipcMain.on('onInputPassphrase', (evt, payload) => {
        console.log('on onInputPassphrase event:: ', payload)
        this.passphrase = payload
    })

    ipcMain.on('getPassphrase', (evt, payload) => {
        console.log('on getPassphrase event:: ', payload)
        evt.reply('replyPassphrase', this.passphrase)
    })*/
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});