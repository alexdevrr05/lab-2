// este es el archivo material.js

let idmaterial = document.getElementById('idmaterial');
let nombre = document.getElementById('nombre');
let cantidad = document.getElementById('cantidad');
let volumen = document.getElementById('volumen');
let unidad = document.getElementById('unidad');
let imagen = document.getElementById('imagen');
let btnform = document.getElementById('btnform');
let btnUpdate = document.getElementById('btnUpdate');
const form = document.getElementById('material-form');
let subtitle = document.getElementById('subtitle');

window.addEventListener('DOMContentLoaded', () => {
  const updateTable = (data) => {
    let mylista1 = document.getElementById('mylista1');
    let template = '';
    subtitle.textContent = '';
    tableMateriales.style.display = '';

    if (data.length === 0) {
      subtitle.textContent = 'Comienza agregando materiales';
      tableMateriales.style.display = 'none';
    }

    const list = data;
    list.forEach((element) => {
      template += `
         <tr>
            <td class="centrado">${element.nombre}</td>
            <td class="centrado">${element.cantidad}</td>
            <td class="centrado">${element.volumen}</td>
            <td class="centrado">${element.unidad}</td>
            <td class="centrado">
              <img src="../uploads/${element.imagen}" alt="Imagen" width="100">
            </td>

            <td class="centrado">
              <button class="btn btn-danger" value="${element.id}" data-imagen="${element.imagen}">
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

      mylista1.innerHTML = template;
    });

    // Agregar evento click a los botones de eliminar
    const deleteButtons = document.querySelectorAll('.btn.btn-danger');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', handleDelete);
    });
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

btnform.addEventListener('click', async (e) => {
  e.preventDefault(); // Evitar el evento por defecto del botón
  if (isValidForm()) {
    addProductRenderer();
  }
});

const addProductRenderer = async () => {
  const objMaterial = {
    nombre: nombre.value,
    cantidad: cantidad.value,
    volumen: volumen.value,
    unidad: unidad.value,
    imagen: imagen.files[0].path,
  };

  await window.electronAPI.addMaterial(objMaterial);

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
};

const clearinput = () => {
  idmaterial.value = '';
  nombre.value = '';
  cantidad.value = '';
  volumen.value = '';
  unidad.value = '';
  imagen.value = '';
};

const handleDelete = async (event) => {
  const materialId = event.target.value;
  const imagenName = event.target.getAttribute('data-imagen');
  await window.electronAPI.deleteMaterial(materialId, imagenName);

  // Petición a MySQL para obtener los datos actualizados
  window.electronAPI.executeQuery('SELECT * FROM material', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Actualizar la tabla con los nuevos datos
    }
  });
};
