let title = document.getElementById('title');
let btnform = document.getElementById('btnform');

let nombre = document.getElementById('nombre');
let cantidad = document.getElementById('cantidad');
let practica = document.getElementById('practica');
let material = document.getElementById('material');
let unidades = document.getElementById('unidades');
let imagen = document.getElementById('imagen');

const botonBuscar = document.getElementById('boton-buscar');
const busquedaInput = document.getElementById('busqueda-input');

window.addEventListener('DOMContentLoaded', () => {
  const updateTable = (data) => {
    let listadoEquipos = document.getElementById('listado-equipos');
    let template = '';
    title.textContent = 'Equipos';

    if (data.length === 0) {
      title.textContent =
        'Comienza agregando equipos o no hay resultados de la búsqueda';
    }

    const list = data.reverse();
    list.forEach((equipo) => {
      template += `
        <div class="card">
            <a href="equipo-by-id.html?id=${equipo.id}">
            <div class="card-container">
                <img src="../uploads/${equipo.imagen}" alt="img-${equipo.id}" />
            </div>
            </a>
            
            <div class="contenido-card">
              <p>${equipo.nombre}</p>
              <button class="btn btn-danger btn-sm delete" value="${equipo.id}" data-imagen="${equipo.imagen}">Eliminar</button>
            </div>
        </div>
        `;
    });
    listadoEquipos.innerHTML = template;

    // Agregar evento click a los botones de eliminar
    const deleteButtons = document.querySelectorAll('.btn.btn-danger');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', handleDelete);
    });
  };

  // Petición inicial a la base de datos para obtener los datos
  window.electronAPI.executeQuery('SELECT * FROM equipos', (error, data) => {
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
  const practicaValue = practica.value.trim();
  const materialValue = material.value.trim();
  const unidadesValue = unidades.value.trim();
  const imagenValue = imagen.value.trim();

  if (
    nombreValue === '' ||
    cantidadValue === '' ||
    practicaValue === '' ||
    materialValue === '' ||
    unidadesValue === '' ||
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
  handleBuscarEquipos();
});

busquedaInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleBuscarEquipos();
  }
});

const handleBuscarEquipos = async () => {
  const busquedaInput = document.getElementById('busqueda-input');
  const query = busquedaInput.value.trim();

  window.electronAPI.executeQuery(
    `SELECT * FROM equipos WHERE nombre LIKE '%${query}%' OR practica LIKE '%${query}%'`,
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
  const objEquipo = {
    nombre: nombre.value,
    cantidad: cantidad.value ? cantidad.value : 0,
    practica: practica.value,
    material: material.value,
    unidades: unidades.value,
    imagen: imagen.files[0].path,
  };

  await window.electronAPI.addEquipo(objEquipo);

  // Limpiar todos los campos
  clearInput();

  // Petición a la base de datos para obtener los datos actualizados
  window.electronAPI.executeQuery('SELECT * FROM equipos', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Actualizar la tabla con los nuevos datos
    }
  });
};

const clearInput = () => {
  nombre.value = '';
  cantidad.value = '';
  practica.value = '';
  material.value = '';
  unidades.value = '';
  imagen.value = '';
};

const handleDelete = async (event) => {
  const equipoId = event.target.value;
  const imagenName = event.target.getAttribute('data-imagen');
  await window.electronAPI.deleteEquipo(equipoId, imagenName);

  // Petición a la base de datos para obtener los datos actualizados
  window.electronAPI.executeQuery('SELECT * FROM equipos', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Actualizar la tabla con los nuevos datos
    }
  });
};
