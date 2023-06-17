const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
let db = require('./bd/conexionbd');
const { setMainMenu } = require('./js/menu/menu');

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
  const query = `INSERT INTO material (nombre, cantidad, volumen, unidad, imagen) VALUES (?, ?, ?, ?, ?)`;
  const values = [
    material.nombre,
    material.cantidad,
    material.volumen,
    material.unidad,
    material.imagen,
  ];

  db.query(query, values, (error, result) => {
    if (error) {
      event.reply('add-material-result', { error });
    } else {
      event.reply('add-material-result', { result });
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

function createWindowpractica() {
  win = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation:true,
      // devTools:false,
      preload: path.join(__dirname, './js/practica.js'),
    },
  });

  win.loadFile('./html/practica.html');
}

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

ipcMain.handle('get', () => {
  getProducts();
});

ipcMain.handle('getMateriales', () => {
  getProductsMaterial();
});

ipcMain.handle('add', (event, obj) => {
  addProduct(obj);
});

ipcMain.handle('get_one', (event, obj) => {
  getproduct(obj);
});

ipcMain.handle('remove_product', (event, obj) => {
  deleteproduct(obj);
});

ipcMain.handle('update', (event, obj) => {
  updateproduct(obj);
});

//// FUNCIONES DUPLICADAS- Sobrecarga de metodos
function getProducts() {
  db.query('SELECT * FROM reactivos', (error, results, fields) => {
    if (error) {
      console.log(error);
    }

    win.webContents.send('products', results);
  });
}

function getProductsMaterial() {
  db.query('SELECT * FROM material', (error, results, fields) => {
    if (error) {
      console.log(error);
    }

    win.webContents.send('products', results);
  });
}

function addProduct(obj) {
  const sql = 'INSERT INTO reactivos SET ?';
  db.query(sql, obj, (error, results, fields) => {
    if (error) {
      console.log(error);
    }
    getProducts();
  });
}

function deleteproduct(obj) {
  const { id } = obj;
  const sql = 'DELETE FROM reactivos WHERE id = ?';
  db.query(sql, id, (error, results, fields) => {
    if (error) {
      console.log(error);
    }
    getProducts();
  });
}

function getproduct(obj) {
  let { id } = obj;
  let sql = 'SELECT * FROM reactivos WHERE id = ?';
  db.query(sql, id, (error, results, fields) => {
    if (error) {
      console.log(error);
    }
    console.log(results);
    win.webContents.send('product', results[0]);
  });
}

function updateproduct(obj) {
  let { id, nombre, formula, cantidad, azul, rojo, amarillo, blanco } = obj;
  const sql =
    'UPDATE reactivos SET nombre=?, formula=?, cantidad=?, azul=?, rojo=?, amarillo=?, blanco=? WHERE id=?';
  db.query(
    sql,
    [nombre, formula, cantidad, azul, rojo, amarillo, blanco, id],
    (error, results, fields) => {
      if (error) {
        console.log(error);
      }
      getProducts();
    }
  );
}

function addProduct(obj) {
  const sql = 'INSERT INTO material SET ?';
  db.query(sql, obj, (error, results, fields) => {
    if (error) {
      console.log(error);
    }
    getProducts();
  });
}

function deleteproduct(obj) {
  const { id } = obj;
  const sql = 'DELETE FROM material WHERE id = ?';
  db.query(sql, id, (error, results, fields) => {
    if (error) {
      console.log(error);
    }
    getProducts();
  });
}

function getproduct(obj) {
  let { id } = obj;
  let sql = 'SELECT * FROM material WHERE id = ?';
  db.query(sql, id, (error, results, fields) => {
    if (error) {
      console.log(error);
    }
    console.log(results);
    win.webContents.send('product', results[0]);
  });
}

function updateproduct(obj) {
  let { id, nombre, cantidad, volumen, unidad, imagen } = obj;
  const sql =
    'UPDATE material SET nombre=?, cantidad=?, volumen=?, unidad=?,  imagen=? WHERE id=?';
  db.query(
    sql,
    [nombre, cantidad, volumen, unidad, imagen, id],
    (error, results, fields) => {
      if (error) {
        console.log(error);
      }
      getProducts();
    }
  );
}
