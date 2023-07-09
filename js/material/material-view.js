let title = document.getElementById('title');
let btnform = document.getElementById('btnform');

let clasificacion = document.getElementById('clasificacion');
let nombre = document.getElementById('nombre');
let cantidad = document.getElementById('cantidad');

let tamanio = document.getElementById('tamanio');
let unidades = document.getElementById('unidades');
let caract_esp = document.getElementById('caract_esp');
let imagen = document.getElementById('imagen');

const botonBuscar = document.getElementById('boton-buscar');
const busquedaInput = document.getElementById('busqueda-input');

window.addEventListener('DOMContentLoaded', () => {
  const updateTable = (data) => {
    let listadoMateriales = document.getElementById('listado-materiales');
    let template = '';
    title.textContent = 'Todos los materiales';

    if (data.length === 0) {
      title.textContent =
        'Comienza agregando materiales o no hay resultados de la búsqueda';
    }

    const list = data.reverse();
    list.forEach((material) => {
      template += `
        <div class="card">
            <a href="material-by-id.html?id=${material.id}">
            <div class="card-container">
                <img src="../uploads/${material.imagen}" alt="img-${material.id}" />
            </div>
            </a>
            
            <div class="contenido-card">
              <p>${material.nombre}</p>
              <button class="btn btn-danger btn-sm delete" value="${material.id}" data-imagen="${material.imagen}">Eliminar</button>
            </div>
        </div>
        `;
    });

    listadoMateriales.innerHTML = template;

    // Agregar evento click a los botones de eliminar
    const deleteButtons = document.querySelectorAll('.btn.btn-danger');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', handleDelete);
    });
  };

  // Petición inicial a MySQL para obtener los datos
  window.electronAPI.executeQuery('select * from materiales', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Mostrar los resultados iniciales
    }
  });

  window.electronAPI.receiveQueryResult((event, data) => {
    updateTable(data);
  });
});

// Validar que los campos no vengan vacíos
const isValidForm = () => {
  const nombreValue = nombre.value.trim();
  const cantidadValue = cantidad.value.trim();
  const volumenValue = tamanio.value.trim();
  const unidadValue = unidades.value.trim();
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

botonBuscar.addEventListener('click', (event) => {
  event.preventDefault();
  handleBuscarMateriales();
});

busquedaInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleBuscarMateriales();
  }
});

const handleBuscarMateriales = async () => {
  const busquedaInput = document.getElementById('busqueda-input');
  const query = busquedaInput.value.trim();

  window.electronAPI.executeQuery(
    `select * from materiales WHERE nombre LIKE '%${query}%'`,
    (error, data) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
      } else {
        updateTable(data);
      }
    }
  );
};

const addProductRenderer = async () => {
  const objMaterial = {
    clasificacion: clasificacion.value,
    nombre: nombre.value,
    cantidad: cantidad.value,
    tamanio: tamanio.value,
    unidades: unidades.value,
    caract_esp: caract_esp.value,
    imagen: imagen.files[0].path,
  };

  await window.electronAPI.addMaterial(objMaterial);

  // Limpiar todos los campos
  clearinput();

  // Petición a MySQL para obtener los datos actualizados
  window.electronAPI.executeQuery('select * from materiales', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Actualizar la tabla con los nuevos datos
    }
  });
};

const clearinput = () => {
  nombre.value = '';
  cantidad.value = '';
  tamanio.value = '';
  unidades.value = '';
  imagen.value = '';
};

const handleDelete = async (event) => {
  const materialId = event.target.value;
  const imagenName = event.target.getAttribute('data-imagen');
  await window.electronAPI.deleteMaterial(materialId, imagenName);

  // Petición a MySQL para obtener los datos actualizados
  window.electronAPI.executeQuery('select * from materiales', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Actualizar la tabla con los nuevos datos
    }
  });
};
