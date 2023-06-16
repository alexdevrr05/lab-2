const { ipcRenderer } = require('electron')

let btnlogin;
let nomUsar;
let passUsar;

window.onload = function() {
    nomUsar = document.getElementById("nomUsar")
    passUsar = document.getElementById("passUsar")
    btnlogin = document.getElementById("login")

    btnlogin.onclick = function() {

        const obj = { nomUsar: nomUsar.value, passUsar: passUsar.value }

        ipcRenderer.invoke("login", obj)
    }
}