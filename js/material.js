const { ipcRenderer } = require('electron')

let mylista1;
let idmaterial;
let nombre;
let cantidad;
let volumen;
let unidad;
let imagen;
let btnform;
let btnUpdate;
let btndelete;
let btnedit;


/*document.addEventListener("DOMContentLoaded", function() {
 
})*/



window.onload = function() {
    mylista1 = document.getElementById("mylista1")
    idmaterial = document.getElementById("idmaterial")
    nombre = document.getElementById("nombre")
    cantidad = document.getElementById("cantidad")
    volumen = document.getElementById("volumen")
    unidad = document.getElementById("unidad")
    imagen = document.getElementById("imagen")
    btnform = document.getElementById("btnform")
    btnUpdate = document.getElementById("btnUpdate")
    btnform.onclick = renderAddProduct
    btnUpdate.onclick = renderUpdateProduct
    renderGetProducts()



};


async function renderGetProducts() {
    await ipcRenderer.invoke('getMateriales')
}


async function renderAddProduct() {
    const obj = {
        nombre: nombre.value,
        cantidad: parseInt(cantidad.value),
        volumen: parseInt(volumen.value),
        unidad: unidad.value,
        imagen: imagen.value

    }
    nombre.value = ""
    cantidad.value = ""
    volumen.value = ""
    unidad.value = ""
    imagen.value = ""
    await ipcRenderer.invoke('add', obj)
}



ipcRenderer.on('products', (event, results) => {


    let template = ""
    const list = results
    list.forEach(element => {
        template += `
         <tr>
            <td class="centrado">${element.nombre}</td>
            <td class="centrado">${element.cantidad}</td>
            <td class="centrado">${element.volumen}</td>
            <td class="centrado">${element.unidad}</td>
            <td class="centrado">${element.imagen}</td>
            <td class="centrado">
              <button class="btn btn-danger"
                value="${element.id}"
                > 
                Eliminar
              </button>
             </td>
             
             <td class="centrado">
               <button class="btn btn-info"   
                 id="btnedit"
                 value="${element.id}"> 
                Editar
              </button>
           
            </td>
         </tr>
      `
    });

    mylista1.innerHTML = template
    btndelete = document.querySelectorAll(".btn-danger")
    btndelete.forEach(boton => {
        boton.addEventListener("click", renderdeleteproduct)
    })

    btnedit = document.querySelectorAll(".btn-info")
    btnedit.forEach(boton => {
        boton.addEventListener("click", rendergetproduct)
    })

});


async function renderdeleteproduct(e) {

    const obj = { id: parseInt(e.target.value) }
    await ipcRenderer.invoke('remove_product', obj)
}

async function rendergetproduct(e) {
    const obj = { id: parseInt(e.target.value) }
    await ipcRenderer.invoke("get_one", obj)

}

ipcRenderer.on('product', (event, result) => {
    idmaterial.value = result.id
    nombre.value = result.nombre
    cantidad.value = result.cantidad
    volumen.value = result.volumen
    unidad.value = result.unidad
    imagen.value = result.imagen
});

async function renderUpdateProduct() {
    const obj = {
        id: idmaterial.value,
        nombre: nombre.value,
        cantidad: cantidad.value,
        volumen: volumen.value,
        unidad: unidad.value,
        imagen: imagen.value,

    }

    clearinput()
    await ipcRenderer.invoke("update", obj)
}

function clearinput() {
    idmaterial.value = ""
    nombre.value = ""
    cantidad.value = ""
    volumen.value = ""
    unidad.value = ""
    imagen.value = ""
}