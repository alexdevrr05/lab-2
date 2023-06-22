// este es el archivo preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateTheme: (callback) => ipcRenderer.on('update-theme', callback),
  executeQuery: (query, callback) => ipcRenderer.send('execute-query', query),
  executeQueries: (queries, callback) =>
    ipcRenderer.send('execute-queries', queries),
  receiveQueryResult: (callback) => ipcRenderer.on('query-result', callback),
  receiveQueriesResults: (callback) =>
    ipcRenderer.on('queries-results', callback),
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
  showMaterial: (materialId) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('show-material', materialId);
      ipcRenderer.once('show-material-result', (event, response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.material);
        }
      });
    });
  },
  deleteMaterial: (materialId, imageName) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('delete-material', { materialId, imageName });
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
          resolve(response.insertId);
        }
      });
    });
  },
  addPracticaMateriales: (practica) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('add-practica-materiales', practica);
      ipcRenderer.once('add-practica-result-materiales', (event, response) => {
        if (response.error) {
          console.log('ERROR');
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
