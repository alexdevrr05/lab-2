const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateTheme: (callback) => ipcRenderer.on('update-theme', callback),
  executeQuery: (query, callback) => ipcRenderer.send('execute-query', query),
  receiveQueryResult: (callback) => ipcRenderer.on('query-result', callback),
  executeQueryWithValues: (query, values, callback) =>
    ipcRenderer.send('execute-query-with-values', query, values, callback),

  addMaterial: (material) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('add-material', material);
      ipcRenderer.once('add-material-result', (event, response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
    });
  },
  deleteMaterial: (materialId) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('delete-material', materialId);
      ipcRenderer.once('delete-material-result', (event, response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
    });
  },
  addReactivo: (reactivo) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('add-reactivo', reactivo);
      ipcRenderer.once('add-reactivo-result', (event, response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
    });
  },
  deleteReactivo: (reactivoId) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('delete-reactivo', reactivoId);
      ipcRenderer.once('delete-reactivo-result', (event, response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
    });
  },
  addPractica: (practica) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('add-practica', practica);
      ipcRenderer.once('add-practica-result', (event, response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
    });
  },
  deletePractica: (practicaId) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('delete-practica', practicaId);
      ipcRenderer.once('delete-practica-result', (event, response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
    });
  },
});
