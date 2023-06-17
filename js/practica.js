window.addEventListener('DOMContentLoaded', () => {
  window.electronAPI.executeQuery('SELECT * FROM practica', (error) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    }
  });

  window.electronAPI.receiveQueryResult((event, data) => {
    let mylist = document.getElementById('mylist');
    let template = '';
    const list = results;
    list.forEach((element) => {
      template += `
         <tr>
            <td class="centrado">${element.nombre}</td>
            <td class="centrado">${element.formula}</td>
            <td class="centrado">${element.cantidad}</td>
            <td class="centrado">${element.azul}</td>
            <td class="centrado">${element.rojo}</td>
            <td class="centrado">${element.amarillo}</td>
            <td class="centrado">${element.blanco}</td>
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
      `;
    });
    mylist.innerHTML = template;
  });
});

// const { ipcRenderer } = require('electron')

// let mylist;
// let idreactivo;
// let nombre;
// let formula;
// let cantidad;
// let azul;
// let rojo;
// let amarillo;
// let blanco;
// let btnform;
// let btnUpdate;
// let btndelete;
// let btnedit;

// /*document.addEventListener("DOMContentLoaded", function() {

// })*/

// window.onload = function() {
//     mylist = document.getElementById("mylist")
//     idreactivo = document.getElementById("idreactivo")
//     nombre = document.getElementById("nombre")
//     formula = document.getElementById("formula")
//     cantidad = document.getElementById("cantidad")
//     azul = document.getElementById("azul")
//     rojo = document.getElementById("rojo")
//     amarillo = document.getElementById("amarillo")
//     blanco = document.getElementById("blanco")
//     btnform = document.getElementById("btnform")
//     btnUpdate = document.getElementById("btnUpdate")
//     btnform.onclick = renderAddProduct
//     btnUpdate.onclick = renderUpdateProduct
//     renderGetProducts()

// };

// //async function renderGetProducts() {
// //    await ipcRenderer.invoke('get')
// //}

// async function renderAddProduct() {
//     const obj = {
//         nombre: nombre.value,
//         formula: formula.value,
//         cantidad: parseInt(cantidad.value),
//         azul: parseInt(azul.value),
//         rojo: parseInt(rojo.value),
//         amarillo: parseInt(amarillo.value),
//         blanco: blanco.value

//     }
//     nombre.value = ""
//     formula.value = ""
//     cantidad.value = ""
//     azul.value = ""
//     rojo.value = ""
//     amarillo.value = ""
//     blanco.value = ""
//     await ipcRenderer.invoke('add', obj)
// }

// ipcRenderer.on('products', (event, results) => {

//     let template = ""
//     const list = results
//     list.forEach(element => {
//         template += `
//          <tr>
//             <td class="centrado">${element.nombre}</td>
//             <td class="centrado">${element.formula}</td>
//             <td class="centrado">${element.cantidad}</td>
//             <td class="centrado">${element.azul}</td>
//             <td class="centrado">${element.rojo}</td>
//             <td class="centrado">${element.amarillo}</td>
//             <td class="centrado">${element.blanco}</td>
//             <td class="centrado">
//               <button class="btn btn-danger"
//                 value="${element.id}"
//                 >
//                 Eliminar
//               </button>
//              </td>

//              <td class="centrado">
//                <button class="btn btn-info"
//                  id="btnedit"
//                  value="${element.id}">
//                 Editar
//               </button>

//             </td>
//          </tr>
//       `
//     });

//     mylist.innerHTML = template
//     btndelete = document.querySelectorAll(".btn-danger")
//     btndelete.forEach(boton => {
//         boton.addEventListener("click", renderdeleteproduct)
//     })

//     btnedit = document.querySelectorAll(".btn-info")
//     btnedit.forEach(boton => {
//         boton.addEventListener("click", rendergetproduct)
//     })

// });

// async function renderdeleteproduct(e) {

//     const obj = { id: parseInt(e.target.value) }
//     await ipcRenderer.invoke('remove_product', obj)
// }

// async function rendergetproduct(e) {
//     const obj = { id: parseInt(e.target.value) }
//     await ipcRenderer.invoke("get_one", obj)

// }

// ipcRenderer.on('product', (event, result) => {
//     idreactivo.value = result.id
//     nombre.value = result.nombre
//     formula.value = result.formula
//     cantidad.value = result.cantidad
//     azul.value = result.azul
//     rojo.value = result.rojo
//     amarillo.value = result.amarillo
//     blanco.value = result.blanco
// });

// async function renderUpdateProduct() {
//     const obj = {
//         id: idreactivo.value,
//         nombre: nombre.value,
//         formula: formula.value,
//         cantidad: cantidad.value,
//         azul: azul.value,
//         rojo: rojo.value,
//         amarillo: amarillo.value,
//         blanco: blanco.value,

//     }

//     clearinput()
//     await ipcRenderer.invoke("update", obj)
// }

// function clearinput() {
//     idreactivo.value = ""
//     nombre.value = ""
//     formula.value = ""
//     cantidad.value = ""
//     azul.value = ""
//     rojo.value = ""
//     amarillo.value = ""
//     blanco.value = ""
// }
