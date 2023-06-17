let idmaterial = document.getElementById('idmaterial');
let nombre = document.getElementById('nombre');
let cantidad = document.getElementById('cantidad');
let volumen = document.getElementById('volumen');
let unidad = document.getElementById('unidad');
let imagen = document.getElementById('imagen');
let btnform = document.getElementById('btnform');
let btnUpdate = document.getElementById('btnUpdate');

window.addEventListener('DOMContentLoaded', () => {
  // petición a mysql
  window.electronAPI.executeQuery('SELECT * FROM material', (error) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    }
  });

  // obtener y mostrar resultados
  window.electronAPI.receiveQueryResult((event, data) => {
    let mylista1 = document.getElementById('mylista1');

    let template = '';
    const list = data.results;
    list.map((element) => {
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
      `;
    });

    mylista1.innerHTML = template;
    //   btndelete = document.querySelectorAll('.btn-danger');
    //   btndelete.forEach((boton) => {
    //     boton.addEventListener('click', renderdeleteproduct);
    //   });

    //   btnedit = document.querySelectorAll('.btn-info');
    //   btnedit.forEach((boton) => {
    //     boton.addEventListener('click', rendergetproduct);
    //   });
  });
});

// Validar que los campos no vengan vacíos
const isValidForm = () => {
  const nombreValue = nombre.value.trim();
  const cantidadValue = cantidad.value.trim();
  const volumenValue = volumen.value.trim();
  const unidadValue = unidad.value.trim();
  const imagenValue = imagen.value.trim();

  if (
    nombreValue === '' ||
    cantidadValue === '' ||
    volumenValue === '' ||
    unidadValue === '' ||
    imagenValue === ''
  ) {
    alert('Por favor, completa todos los campos');
    return false;
  }

  return true;
};

btnform.addEventListener('click', async () => {
  if (isValidForm()) {
    renderAddProduct();
  }
});

async function renderAddProduct() {
  const objMaterial = {
    nombre: nombre.value,
    cantidad: cantidad.value,
    volumen: volumen.value,
    // cantidad: parseInt(cantidad.value) | 0,
    // volumen: parseInt(volumen.value) | 0,
    unidad: unidad.value,
    imagen: imagen.value,
  };

  const result = await window.electronAPI.addMaterial(objMaterial);
  console.log('Material agregado correctamente:', result);

  // Limpiar todos los campos
  clearinput();
}

const clearinput = () => {
  idmaterial.value = '';
  nombre.value = '';
  cantidad.value = '';
  volumen.value = '';
  unidad.value = '';
  imagen.value = '';
};

// async function renderdeleteproduct(e) {
//   const obj = { id: parseInt(e.target.value) };
//   await ipcRenderer.invoke('remove_product', obj);
// }

// async function rendergetproduct(e) {
//   const obj = { id: parseInt(e.target.value) };
//   await ipcRenderer.invoke('get_one', obj);
// }

// ipcRenderer.on('product', (event, result) => {
//   idmaterial.value = result.id;
//   nombre.value = result.nombre;
//   cantidad.value = result.cantidad;
//   volumen.value = result.volumen;
//   unidad.value = result.unidad;
//   imagen.value = result.imagen;
// });

// async function renderUpdateProduct() {
//   const obj = {
//     id: idmaterial.value,
//     nombre: nombre.value,
//     cantidad: cantidad.value,
//     volumen: volumen.value,
//     unidad: unidad.value,
//     imagen: imagen.value,
//   };

//   clearinput();
//   await ipcRenderer.invoke('update', obj);
// }
