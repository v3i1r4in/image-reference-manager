const {
    contextBridge,
    remote,
    webFrame
} = require("electron");

webFrame.setVisualZoomLevelLimits(1, 10);
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electron", remote.require("electron"));
contextBridge.exposeInMainWorld("fs", remote.require("fs"));
contextBridge.exposeInMainWorld("path", remote.require("path"));