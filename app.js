const { app, BrowserWindow, ipcMain, webContents  } = require('electron')
const Main = require('./controller/main')
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
        const MainProcess = new Main({
            msgFn: (channel = 'msg:update', msg) => {
                win.webContents.send(channel, msg)
            }
        })
        MainProcess.run()
    })

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});