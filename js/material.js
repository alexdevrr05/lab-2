let idmaterial = document.getElementById('idmaterial');
let nombre = document.getElementById('nombre');
let cantidad = document.getElementById('cantidad');
let volumen = document.getElementById('volumen');
let unidad = document.getElementById('unidad');
let imagen = document.getElementById('imagen');
let btnform = document.getElementById('btnform');
let btnUpdate = document.getElementById('btnUpdate');

window.addEventListener('DOMContentLoaded', () => {
  // Función para obtener y mostrar resultados
  const updateTable = (data) => {
    let mylista1 = document.getElementById('mylista1');
    let template = '';
    const list = data.results;
    list.forEach((element) => {
      template += `
         <tr>
            <td class="centrado">${element.nombre}</td>
            <td class="centrado">${element.cantidad}</td>
            <td class="centrado">${element.volumen}</td>
            <td class="centrado">${element.unidad}</td>
            <td class="centrado">${element.imagen}</td>
            <td class="centrado">
              <button class="btn btn-danger" value="${element.id}">
                Eliminar
              </button>
             </td>
             <td class="centrado">
               <button class="btn btn-info" id="btnedit" value="${element.id}">
                Editar
              </button>
            </td>
         </tr>
      `;
    });
    mylista1.innerHTML = template;
  };

  /**
   * se realiza una consulta durante la carga inicial
   * del documento y se actualiza la tabla con los resultados.
   *  No se realizan dos consultas separadas durante la carga del documento.
   */

  // Petición inicial a MySQL para obtener los datos
  window.electronAPI.executeQuery('SELECT * FROM material', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Mostrar los resultados iniciales
    }
  });

  // Escuchar el evento 'query-result' para actualizar la tabla con nuevos datos
  window.electronAPI.receiveQueryResult((event, data) => {
    updateTable(data);
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
    unidad: unidad.value,
    // imagen: imagen.value,
    imagen: 'example.png',
  };

  const result = await window.electronAPI.addMaterial(objMaterial);
  console.log('Material agregado correctamente:', result);

  // Limpiar todos los campos
  clearinput();

  // Petición a MySQL para obtener los datos actualizados
  window.electronAPI.executeQuery('SELECT * FROM material', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Actualizar la tabla con los nuevos datos
    }
  });
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
