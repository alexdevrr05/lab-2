const { BrowserWindow } = require('electron');


let mainWindow = new BrowserWindow({ width: 800, height: 600 })
mainWindow.loadFile('index.html')

let childWindow = null

document.getElementById('material').addEventListener('click', () => {
    childWindow = new BrowserWindow({ parent: mainWindow })
    childWindow.loadFile('child.html')
})