const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
    const window = new BrowserWindow({
        width: 200,
        height: 600,
        minWidth: 200,
        minHeight: 190,
        webPreferences: {
            nodeIntegration: true
        }
    });
    window.loadFile('./html/index.html');
});