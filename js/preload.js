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
  showReactivo: (reactivoId) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('show-reactivo', reactivoId);
      ipcRenderer.once('show-reactivo-result', (event, response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.reactivo);
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
  updateMaterial: (updatedMaterial) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.once('material:update', (event, response) => {
        if (response.success) {
          resolve();
        } else {
          reject(response.error);
        }
      });
      ipcRenderer.send('material:update', updatedMaterial);
    });
  },
  uploadMaterialImage: (imageFile, materialId) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Data = reader.result.split(',')[1];

        ipcRenderer.send('upload-material-image', {
          image: base64Data,
          materialId,
        });

        ipcRenderer.once('upload-material-image-result', (event, response) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error(response.error));
          }
        });
      };

      reader.onerror = () => {
        reject(new Error('Error al leer la imagen'));
      };

      reader.readAsDataURL(imageFile);
    });
  },
  updateEquipo: (updatedEquipo) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.once('equipo:update', (event, response) => {
        if (response.success) {
          resolve();
        } else {
          reject(response.error);
        }
      });
      ipcRenderer.send('equipo:update', updatedEquipo);
    });
  },
  uploadEquipoImage: (imageFile, equipoId) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Data = reader.result.split(',')[1];

        ipcRenderer.send('upload-equipo-image', {
          image: base64Data,
          equipoId,
        });

        ipcRenderer.once('upload-equipo-image-result', (event, response) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error(response.error));
          }
        });
      };

      reader.onerror = () => {
        reject(new Error('Error al leer la imagen'));
      };

      reader.readAsDataURL(imageFile);
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
  updatedReactivo: (updatedReactivo) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.once('reactivo:update', (event, response) => {
        if (response.success) {
          resolve();
        } else {
          reject(response.error);
        }
      });
      ipcRenderer.send('reactivo:update', updatedReactivo);
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
  getMaterialesPractica: (idPractica) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('get-materiales-practica', idPractica);
      ipcRenderer.once('get-materiales-practica-result', (event, response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
    });
  },
  addEquipo: (equipo) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('add-equipo-lab', equipo);
      ipcRenderer.once('add-equipo-lab-result', (event, response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
    });
  },
  showEquipo: (equipoId) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('show-equipo', equipoId);
      ipcRenderer.once('show-equipo-result', (event, response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.equipo);
        }
      });
    });
  },
  deleteEquipo: (equipoId, imageName) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('delete-equipo', { equipoId, imageName });
      ipcRenderer.once('delete-equipo-result', (event, response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
    });
  },
});
