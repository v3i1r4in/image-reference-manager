// Modules to control application life and create native browser window
const {app, BrowserWindow, protocol} = require('electron');
const path = require('path');
const url = require('url');

function createWindow () {
  const mainWindow = new BrowserWindow({
    title: 'Image Reference Manager',
    width: 1400,
    height: 1000,
    minWidth: 1200,
    minHeight: 1000,
    titleBarStyle: 'hidden',
    titleBarStyle: 'hiddenInset',
    maximizable: true,
    webPreferences: {
      webSecurity: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  const startUrl = process.env.ELECTRON_START_URL || url.format({
      pathname: path.join(__dirname, 'build/index.html'),
      protocol: 'file:',
      slashes: true
  });
  mainWindow.loadURL(startUrl);
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  protocol.registerFileProtocol('file', (request, cb) => {
    const url = request.url.replace('file:///', '');
    const decodedUrl = decodeURI(url);
    try {
      return cb(decodedUrl);
    } catch (error) {
      console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error);
    }
  });
});
