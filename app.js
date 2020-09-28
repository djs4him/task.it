const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
    const window = new BrowserWindow({
        width: 230,
        height: 600,
        minWidth: 230,
        minHeight: 190,
        webPreferences: {
            nodeIntegration: true
        },
        icon: './img/logo.png'
    });
    window.setMenu(null);
    window.loadFile('./html/index.html');
});