const { app, BrowserWindow, ipcMain, webContents  } = require('electron')
const main = require('./controller/main')
const Doji = require('./modules/algorithm/Doji')
const path = require('path')
const fs = require('fs');
const Trader = require('./controller/trader')

let win

const createWindow = () => {
    win = new BrowserWindow({
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

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    ipcMain.on('onInputPassphrase', (evt, passphrase) => {
        console.log('on onInputPassphrase event:: ', passphrase)

        if (passphrase) {
            startMain(passphrase)
        }
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

const startMain = async (passphrase) => {
    const account = JSON.parse(fs.readFileSync('./preference/account.json'))
    const doji = new Doji()
    const trader = new Trader({
        algorithmObj: doji,
        mainUrl: account.mainUrl,
        apiKey: account.apiKey,
        secretKey: account.secretKey,
        passphrase
    })

    const second = 1000
    const minute = second * 60

    const res = await trader.getOpenOrder()

    console.log(res)
    win.webContents.send('msg:update', res.data)

    /*await trader.main(win)
    setInterval(async () => {
        await trader.main(win)
    }, minute)*/




}