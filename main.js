// este es el archivo main.js
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
let db = require('./db/conexiondb');
const { setMainMenu } = require('./js/menu/menu');

const fs = require('fs');
const uploadPath = path.join(__dirname, 'uploads');

let win;
let winlogin;

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation:true,
      // devTools:false,
      preload: path.join(__dirname, './js/preload.js'),
    },
  });

  win.loadFile('./html/index.html');

  setMainMenu(win);
}

// Ejecuta queryes
ipcMain.on('execute-query', (event, query) => {
  db.query(query, (error, results) => {
    if (error) {
      event.reply('query-result', { error });
    } else {
      // console.log(results);
      // event.reply('query-result', { results });
      event.reply('query-result', results);
    }
  });
});

ipcMain.on('execute-queries', (event, queries) => {
  const results = [];
  let completedQueries = 0;

  queries.forEach((query, index) => {
    db.query(query, (error, result) => {
      completedQueries++;

      if (error) {
        results[index] = { error };
      } else {
        results[index] = result;
      }

      if (completedQueries === queries.length) {
        event.reply('queries-results', results);
      }
    });
  });
});

ipcMain.on('add-material', (event, material) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // TODO: this line will throw an error because some adjustments are missing in the new table structure
  const query = `INSERT INTO materiales (clasificacion, nombre, cantidad, tamanio, unidades, caract_esp, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const imageData = fs.readFileSync(material.imagen, 'base64');
  const imageExtension = path.extname(material.imagen);
  const newImageName = `image_${Date.now()}${imageExtension}`;
  const imagePath = path.join(uploadPath, newImageName);

  // Eliminar el prefijo de la representación base64 de la imagen
  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
  // Convertir la imagen de base64 a un buffer
  const imageBuffer = Buffer.from(base64Data, 'base64');

  fs.writeFile(imagePath, imageBuffer, (error) => {
    if (error) {
      event.reply('add-material-result', { error: error.message });
    } else {
      const values = [
        material.clasificacion,
        material.nombre,
        material.cantidad,
        material.tamanio,
        material.unidades,
        material.caract_esp,
        newImageName,
      ];

      db.query(query, values, (error, result) => {
        if (error) {
          event.reply('add-material-result', { error: error.message });
        } else {
          event.reply('add-material-result', { result });
        }
      });
    }
  });
});

ipcMain.on('show-material', (event, materialId) => {
  const query = `SELECT * FROM materiales WHERE id = ?`;
  const values = [materialId];

  db.query(query, values, (error, results) => {
    if (error) {
      // Maneja el error de la consulta
      event.reply('show-material-result', { error });
    } else {
      // Envía los datos del material a la vista "material-by-id.html"
      const material = results[0];
      event.reply('show-material-result', { material });
    }
  });
});

ipcMain.on('show-practica', (event, practicaId) => {
  const query = `SELECT * FROM practicas WHERE idPract = ?`;
  const values = [practicaId];

  db.query(query, values, (error, results) => {
    if (error) {
      event.reply('show-practica-result', { error });
    } else {
      const practica = results[0];
      event.reply('show-practica-result', { practica });
    }
  });
});

ipcMain.on('practica:update', (event, updatedPractica) => {
  const { nombre, fecha, descripcion, idPract } = updatedPractica;

  const query = `UPDATE practicas SET nomPract = ?, descPract = ?, fecPract = ? WHERE idPract = ?`;
  const values = [nombre, descripcion, fecha, idPract];

  db.query(query, values, (error, result) => {
    if (error) {
      event.reply('practica:update', { success: false, error: error.message });
    } else {
      event.reply('practica:update', { success: true });
    }
  });
});

ipcMain.on('upload-practica-image', (event, data) => {
  const imageBase64Data = data.image;
  const practicaId = data.practicaId;

  // Eliminar el prefijo de la representación base64 de la imagen
  const base64Data = imageBase64Data.replace(/^data:image\/\w+;base64,/, '');
  // Convertir la imagen de base64 a un buffer
  const imageBuffer = Buffer.from(base64Data, 'base64');

  const newImageName = `image_${Date.now()}.jpg`; // Nombre de archivo generado para la imagen
  // const newImageName = `${practicaId}.jpg`; // Nombre de archivo generado para la imagen
  const imagePath = path.join(uploadPath, newImageName); // Ruta completa para guardar la imagen

  fs.writeFile(imagePath, imageBuffer, (error) => {
    if (error) {
      event.reply('upload-practica-image-result', {
        success: false,
        error: error.message,
      });
    } else {
      const query = 'UPDATE practicas SET imagen = ? WHERE idPract = ?';
      const values = [newImageName, practicaId];
      db.query(query, values, (error, result) => {
        if (error) {
          event.reply('upload-practica-image-result', {
            success: false,
            error: error.message,
          });
        } else {
          event.reply('upload-practica-image-result', { success: true });
        }
      });
    }
  });
});

ipcMain.on('show-equipo', (event, equipoId) => {
  const query = `SELECT * FROM equipos WHERE id = ?`;
  const values = [equipoId];

  db.query(query, values, (error, results) => {
    if (error) {
      event.reply('show-equipo-result', { error });
    } else {
      const equipo = results[0];
      event.reply('show-equipo-result', { equipo });
    }
  });
});

ipcMain.on('show-reactivo', (event, reactivoId) => {
  const query = `SELECT * FROM reactivos WHERE id = ?`;
  const values = [reactivoId];

  db.query(query, values, (error, results) => {
    if (error) {
      // Maneja el error de la consulta
      event.reply('show-reactivo-result', { error });
    } else {
      const reactivo = results[0];
      event.reply('show-reactivo-result', { reactivo });
    }
  });
});

ipcMain.on('delete-material', (event, { materialId, imageName }) => {
  const query = `DELETE FROM materiales WHERE id = ?`;
  const values = [materialId];

  db.query(query, values, (error, result) => {
    if (error) {
      event.reply('delete-material-result', { error });
    } else {
      // Eliminar la imagen del directorio "uploads"
      const imagePath = path.join(__dirname, 'uploads', imageName);
      fs.unlink(imagePath, (error) => {
        if (error) {
          console.error('Error al eliminar la imagen:', error);
        }
      });

      // event.reply('delete-material-result', { result });
      event.reply('delete-material-result', result);
    }
  });
});

ipcMain.on('material:update', (event, updatedMaterial) => {
  const { clasificacion, nombre, cantidad, tamanio, unidades, caract_esp, id } =
    updatedMaterial;

  const query = `UPDATE materiales SET clasificacion = ?, nombre = ?, cantidad = ?, tamanio = ?, unidades = ?, caract_esp = ? WHERE id = ?`;
  const values = [
    clasificacion,
    nombre,
    cantidad,
    tamanio,
    unidades,
    caract_esp,
    id,
  ];

  db.query(query, values, (error, result) => {
    if (error) {
      event.reply('material:update', { success: false, error: error.message });
    } else {
      event.reply('material:update', { success: true });
    }
  });
});

ipcMain.on('reactivo:update', (event, updatedMaterial) => {
  const {
    id,
    grupos,
    nombre,
    cantidad,
    unidad,
    cod_azul,
    cod_rojo,
    cod_amarillo,
    cod_blanco,
    piezas,
  } = updatedMaterial;

  const query = `UPDATE reactivos SET grupos = ?,  nombre = ?, cantidad = ?, unidad = ?, cod_azul = ?, cod_rojo = ?, cod_amarillo = ?, cod_blanco = ?, piezas = ? WHERE id = ?`;
  const values = [
    grupos,
    nombre,
    cantidad,
    unidad,
    cod_azul,
    cod_rojo,
    cod_amarillo,
    cod_blanco,
    piezas,
    id,
  ];

  db.query(query, values, (error, result) => {
    if (error) {
      event.reply('reactivo:update', { success: false, error: error.message });
    } else {
      event.reply('reactivo:update', { success: true });
    }
  });
});

ipcMain.on('upload-material-image', (event, data) => {
  const imageBase64Data = data.image;
  const materialId = data.materialId;

  // Eliminar el prefijo de la representación base64 de la imagen
  const base64Data = imageBase64Data.replace(/^data:image\/\w+;base64,/, '');
  // Convertir la imagen de base64 a un buffer
  const imageBuffer = Buffer.from(base64Data, 'base64');

  const newImageName = `image_${Date.now()}.jpg`; // Nombre de archivo generado para la imagen
  // const newImageName = `${materialId}.jpg`; // Nombre de archivo generado para la imagen
  const imagePath = path.join(uploadPath, newImageName); // Ruta completa para guardar la imagen

  fs.writeFile(imagePath, imageBuffer, (error) => {
    if (error) {
      event.reply('upload-material-image-result', {
        success: false,
        error: error.message,
      });
    } else {
      // Actualizar la columna "imagen" en la tabla correspondiente en la base de datos
      const query = 'UPDATE materiales SET imagen = ? WHERE id = ?';
      const values = [newImageName, materialId];
      db.query(query, values, (error, result) => {
        if (error) {
          event.reply('upload-material-image-result', {
            success: false,
            error: error.message,
          });
        } else {
          event.reply('upload-material-image-result', { success: true });
        }
      });
    }
  });
});

ipcMain.on('equipo:update', (event, updatedEquipo) => {
  const { nombre, cantidad, practica, material, unidades, id } = updatedEquipo;

  const query = `UPDATE equipos SET nombre = ?, cantidad = ?, practica = ?, material = ?, unidades = ? WHERE id = ?`;
  const values = [nombre, cantidad, practica, material, unidades, id];

  db.query(query, values, (error, result) => {
    if (error) {
      event.reply('equipo:update', { success: false, error: error.message });
    } else {
      event.reply('equipo:update', { success: true });
    }
  });
});

ipcMain.on('upload-equipo-image', (event, data) => {
  const imageBase64Data = data.image;
  const equipoId = data.equipoId;

  const base64Data = imageBase64Data.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');

  const newImageName = `image_${Date.now()}.jpg`;

  const imagePath = path.join(uploadPath, newImageName);

  fs.writeFile(imagePath, imageBuffer, (error) => {
    if (error) {
      event.reply('upload-equipo-image-result', {
        success: false,
        error: error.message,
      });
    } else {
      const query = 'UPDATE equipos SET imagen = ? WHERE id = ?';
      const values = [newImageName, equipoId];
      db.query(query, values, (error, result) => {
        if (error) {
          event.reply('upload-equipo-image-result', {
            success: false,
            error: error.message,
          });
        } else {
          event.reply('upload-equipo-image-result', { success: true });
        }
      });
    }
  });
});

ipcMain.on('add-reactivo', (event, reactivo) => {
  const query = `INSERT INTO reactivos (grupos, nombre, cantidad, unidad, cod_azul, cod_rojo, cod_amarillo, cod_blanco, piezas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    reactivo.grupos,
    reactivo.nombre,
    reactivo.cantidad,
    reactivo.unidad,
    reactivo.cod_azul,
    reactivo.cod_rojo,
    reactivo.cod_amarillo,
    reactivo.cod_blanco,
    reactivo.piezas,
  ];

  db.query(query, values, (error, result) => {
    if (error) {
      event.reply('add-reactivo-result', { error });
    } else {
      event.reply('add-reactivo-result', { result });
    }
  });
});

ipcMain.on('delete-reactivo', (event, reactivoId) => {
  const query = `DELETE FROM reactivos WHERE id = ?`;
  const values = [reactivoId];

  db.query(query, values, (error, result) => {
    if (error) {
      event.reply('delete-reactivo-result', { error });
    } else {
      event.reply('delete-reactivo-result', { result });
    }
  });
});

ipcMain.on('add-practica', (event, practica) => {
  const { nombre, descripcion, fecha } = practica;

  const query = `INSERT INTO practicas (nomPract, descPract, fecPract) VALUES (?, ?, ?)`;
  const params = [nombre, descripcion, fecha];

  db.query(query, params, (error, result) => {
    if (error) {
      event.reply('add-practica-result', { error });
    } else {
      const insertId = result.insertId;
      event.reply('add-practica-result', { insertId });
    }
  });
});

ipcMain.on('delete-practica', (event, practicaId) => {
  const query = `DELETE FROM practicas WHERE idPract = ?`;
  const values = [practicaId];

  db.query(query, values, (error, result) => {
    if (error) {
      event.reply('delete-practica-result', { error });
    } else {
      event.reply('delete-practica-result', { result });
    }
  });
});

ipcMain.on('add-practica-materiales', (event, practica) => {
  const values = practica['0']; // Acceder a los valores mediante la clave '0'
  const practicaId = Object.values(values)[0].practicaId;

  const insertQueries = [];
  const insertParams = [];

  Object.entries(values).forEach(([materialId, { cantidad }]) => {
    const query = `INSERT INTO materiales_practicas (id_practica, id_material, cantidad) VALUES (?, ?, ?)`;
    const params = [practicaId, materialId, cantidad];
    insertQueries.push(query);
    insertParams.push(params);
  });

  db.beginTransaction((err) => {
    if (err) {
      event.reply('add-practica-result-materiales', { error: err });
    } else {
      const insertNextQuery = (index) => {
        if (index >= insertQueries.length) {
          db.commit((commitError) => {
            if (commitError) {
              db.rollback(() => {
                event.reply('add-practica-result-materiales', {
                  error: commitError,
                });
              });
            } else {
              event.reply('add-practica-result-materiales', {
                result: 'Success',
              });
            }
          });
          return;
        }

        const query = insertQueries[index];
        const params = insertParams[index];

        db.query(query, params, (error, result) => {
          if (error) {
            db.rollback(() => {
              event.reply('add-practica-result-materiales', { error });
            });
          } else {
            const updateQuery = `UPDATE materiales SET cantidad = cantidad - ? WHERE id = ?`;
            const updateParams = [params[2], params[1]];

            db.query(updateQuery, updateParams, (updateError, updateResult) => {
              if (updateError) {
                db.rollback(() => {
                  event.reply('add-practica-result-materiales', {
                    error: updateError,
                  });
                });
              } else {
                insertNextQuery(index + 1);
              }
            });
          }
        });
      };

      insertNextQuery(0);
    }
  });
});

ipcMain.on('get-materiales-practica', (event, idPractica) => {
  const query = `
    SELECT m.nombre, mp.cantidad
    FROM materiales_practicas mp
    INNER JOIN materiales m ON mp.id_material = m.id
    WHERE mp.id_practica = ?`;

  db.query(query, idPractica, (error, result) => {
    if (error) {
      console.log(error);
      event.reply('get-materiales-practica-result', { error });
    } else {
      event.reply('get-materiales-practica-result', { result });
    }
  });
});

ipcMain.on('add-equipo-lab', (event, equipo) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // const { nombre, cantidad, practica, material, unidades, imagen } = equipo;

  const query = `INSERT INTO equipos (nombre, cantidad, practica, material, unidades, imagen) VALUES (?, ?, ?, ?, ?, ?)`;
  const imageData = fs.readFileSync(equipo.imagen, 'base64');
  const imageExtension = path.extname(equipo.imagen);
  const newImageName = `image_${Date.now()}${imageExtension}`;
  const imagePath = path.join(uploadPath, newImageName);

  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');

  fs.writeFile(imagePath, imageBuffer, (error) => {
    if (error) {
      event.reply('add-equipo-lab-result', { error: error.message });
    } else {
      const values = [
        equipo.nombre,
        equipo.cantidad,
        equipo.practica,
        equipo.material,
        equipo.unidades,
        newImageName,
      ];

      db.query(query, values, (error, result) => {
        if (error) {
          event.reply('add-equipo-lab-result', { error: error.message });
        } else {
          event.reply('add-equipo-lab-result', { result });
        }
      });
    }
  });
});

ipcMain.on('delete-equipo', (event, { equipoId, imageName }) => {
  const query = `DELETE FROM equipos WHERE id = ?`;
  const values = [equipoId];

  db.query(query, values, (error, result) => {
    if (error) {
      event.reply('delete-equipo-result', { error });
    } else {
      // Eliminar la imagen del directorio "uploads"
      const imagePath = path.join(__dirname, 'uploads', imageName);
      fs.unlink(imagePath, (error) => {
        if (error) {
          console.error('Error al eliminar la imagen:', error);
        }
      });

      event.reply('delete-equipo-result', result);
    }
  });
});

function loginWindow() {
  winlogin = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation:true,
      // devTools:false,
      preload: path.join(__dirname, './js/login.js'),
    },
  });

  winlogin.loadFile('./html/login.html');
}

app.whenReady().then(loginWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('login', (event, obj) => {
  validatelogin(obj);
});

function validatelogin(obj) {
  const { nomUsar, passUsar } = obj;
  const sql = 'SELECT * FROM usuarios WHERE nomUsuario=? AND passUsuario=?';
  db.query(sql, [nomUsar, passUsar], (error, results, fields) => {
    if (error) {
      console.log(error);
    }

    if (results.length > 0) {
      createWindow();
      win.show();
      winlogin.close();
    } else {
      new Notification({
        title: 'login',
        body: 'Nombre o Password equivocado',
      }).show();
    }
  });
}
