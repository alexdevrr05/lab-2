const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
let db = require('./bd/conexionbd')

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
            preload: path.join(__dirname, './js/index.js'),
            preload: path.join(__dirname, './js/material.js'),
            preload: path.join(__dirname, './js/reactivo.js'),
        }

    });

    win.loadFile('./html/index.html')
}

function createWindowpractica() {
    win = new BrowserWindow({
        width: 1400,
        height: 800,
        webPreferences: {
            // nodeIntegration: true,
            // contextIsolation:true,
            // devTools:false,
            preload: path.join(__dirname, './js/practica.js')

        }
    })

    win.loadFile('./html/practica.html')
}

function loginWindow() {
    winlogin = new BrowserWindow({
        width: 600,
        height: 600,
        webPreferences: {
            // nodeIntegration: true,
            // contextIsolation:true,
            // devTools:false,
            preload: path.join(__dirname, './js/login.js')

        }
    })

    winlogin.loadFile('./html/login.html')
}



app.whenReady().then(loginWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.handle('login', (event, obj) => {
    validatelogin(obj)
});


function validatelogin(obj) {
    const { nomUsar, passUsar } = obj
    const sql = "SELECT * FROM usuario WHERE nomUsar=? AND passUsar=?"
    db.query(sql, [nomUsar, passUsar], (error, results, fields) => {
        if (error) { console.log(error); }

        if (results.length > 0) {
            createWindow()
            win.show()
            winlogin.close()
        } else {
            new Notification({
                title: "login",
                body: 'Nombre o Password equivocado'
            }).show()
        }

    });
}


ipcMain.handle('get', () => {
    getProducts()
});

ipcMain.handle('getMateriales', () => {
    getProductsMaterial()
});

ipcMain.handle('add', (event, obj) => {
    addProduct(obj)
});


ipcMain.handle('get_one', (event, obj) => {
    getproduct(obj)
});

ipcMain.handle('remove_product', (event, obj) => {
    deleteproduct(obj)
});


ipcMain.handle('update', (event, obj) => {
    updateproduct(obj)
});



//// FUNCIONES DUPLICADAS- Sobrecarga de metodos
function getProducts() {

    db.query('SELECT * FROM reactivos', (error, results, fields) => {
        if (error) {
            console.log(error);
        }

        win.webContents.send('products', results)
    });
}

function getProductsMaterial() {

    db.query('SELECT * FROM material', (error, results, fields) => {
        if (error) {
            console.log(error);
        }

        win.webContents.send('products', results)
    });
}

function addProduct(obj) {
    const sql = "INSERT INTO reactivos SET ?";
    db.query(sql, obj, (error, results, fields) => {
        if (error) {
            console.log(error);
        }
        getProducts()
    });
}

function deleteproduct(obj) {
    const { id } = obj
    const sql = "DELETE FROM reactivos WHERE id = ?"
    db.query(sql, id, (error, results, fields) => {
        if (error) {
            console.log(error);
        }
        getProducts()
    });
}

function getproduct(obj) {
    let { id } = obj
    let sql = "SELECT * FROM reactivos WHERE id = ?"
    db.query(sql, id, (error, results, fields) => {
        if (error) {
            console.log(error);
        }
        console.log(results)
        win.webContents.send('product', results[0])
    });
}


function updateproduct(obj) {
    let { id, nombre, formula, cantidad, azul, rojo, amarillo, blanco } = obj
    const sql = "UPDATE reactivos SET nombre=?, formula=?, cantidad=?, azul=?, rojo=?, amarillo=?, blanco=? WHERE id=?"
    db.query(sql, [nombre, formula, cantidad, azul, rojo, amarillo, blanco, id], (error, results, fields) => {
        if (error) {
            console.log(error);
        }
        getProducts()
    });
}



function addProduct(obj) {
    const sql = "INSERT INTO material SET ?";
    db.query(sql, obj, (error, results, fields) => {
        if (error) {
            console.log(error);
        }
        getProducts()
    });
}

function deleteproduct(obj) {
    const { id } = obj
    const sql = "DELETE FROM material WHERE id = ?"
    db.query(sql, id, (error, results, fields) => {
        if (error) {
            console.log(error);
        }
        getProducts()
    });
}

function getproduct(obj) {
    let { id } = obj
    let sql = "SELECT * FROM material WHERE id = ?"
    db.query(sql, id, (error, results, fields) => {
        if (error) {
            console.log(error);
        }
        console.log(results)
        win.webContents.send('product', results[0])
    });
}


function updateproduct(obj) {
    let { id, nombre, cantidad, volumen, unidad, imagen } = obj
    const sql = "UPDATE material SET nombre=?, cantidad=?, volumen=?, unidad=?,  imagen=? WHERE id=?"
    db.query(sql, [nombre, cantidad, volumen, unidad, imagen, id], (error, results, fields) => {
        if (error) {
            console.log(error);
        }
        getProducts()
    });
}

