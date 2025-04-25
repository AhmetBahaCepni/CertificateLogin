const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getSlots: () => ipcRenderer.invoke('get-slots'),
    signIn: (data) => ipcRenderer.invoke('sign-in', data)
});