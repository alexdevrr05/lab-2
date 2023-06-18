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
      event.reply('query-result', { results });
    }
  });
});

ipcMain.on('add-material', (event, material) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const query = `INSERT INTO material (nombre, cantidad, volumen, unidad, imagen) VALUES (?, ?, ?, ?, ?)`;

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
        material.nombre,
        material.cantidad,
        material.volumen,
        material.unidad,
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

ipcMain.on('delete-material', (event, { materialId, imageName }) => {
  const query = `DELETE FROM material WHERE id = ?`;
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

      event.reply('delete-material-result', { result });
    }
  });
});

ipcMain.on('add-reactivo', (event, reactivo) => {
  const query = `INSERT INTO reactivos (nombre, formula, cantidad, azul, rojo, amarillo, blanco) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    reactivo.nombre,
    reactivo.formula,
    reactivo.cantidad,
    reactivo.azul,
    reactivo.rojo,
    reactivo.amarillo,
    reactivo.blanco,
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
  const query = `INSERT INTO practica (nomPract, fecPract) VALUES (?, ?)`;
  const values = [practica.nombre, practica.fecha];

  db.query(query, values, (error, result) => {
    if (error) {
      event.reply('add-practica-result', { error });
    } else {
      event.reply('add-practica-result', { result });
    }
  });
});

ipcMain.on('delete-practica', (event, practicaId) => {
  const query = `DELETE FROM practica WHERE idPract = ?`;
  const values = [practicaId];

  db.query(query, values, (error, result) => {
    if (error) {
      event.reply('delete-practica-result', { error });
    } else {
      event.reply('delete-practica-result', { result });
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
  const sql = 'SELECT * FROM usuario WHERE nomUsar=? AND passUsar=?';
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
