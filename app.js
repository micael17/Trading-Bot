const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, './modules/preload.js'),
        },
    });

    //ipcMain.handle('ping', () => 'pong')
    //win.loadURL('https://biskitanalytics.smiledev.net/myDashboard/home/serviceReview?projectId=A0018&countryCd=CHN')
    win.loadFile('./html/main.html')
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});