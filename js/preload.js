const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateTheme: (callback) => ipcRenderer.on('update-theme', callback),
  executeQuery: (query, callback) => ipcRenderer.send('execute-query', query),
  receiveQueryResult: (callback) => ipcRenderer.on('query-result', callback),
});
