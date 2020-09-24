const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
    const window = new BrowserWindow({
        width: 220,
        height: 600,
        minWidth: 220,
        minHeight: 190,
        webPreferences: {
            nodeIntegration: true
        }
    });
    window.loadFile('./html/index.html');
});