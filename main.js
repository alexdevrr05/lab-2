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
      const material = results[0]; // Suponiendo que solo obtienes un único resultado
      event.reply('show-material-result', { material });
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
