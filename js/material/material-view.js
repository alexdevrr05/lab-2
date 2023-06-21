let title = document.getElementById('title');
let btnform = document.getElementById('btnform');
let nombre = document.getElementById('nombre');
let cantidad = document.getElementById('cantidad');
let volumen = document.getElementById('volumen');
let unidad = document.getElementById('unidad');
let imagen = document.getElementById('imagen');

window.addEventListener('DOMContentLoaded', () => {
  const updateTable = (data) => {
    let listadoMateriales = document.getElementById('listado-materiales');
    let template = '';
    title.textContent = 'Todos los materiales';

    if (data.results.length === 0) {
      title.textContent = 'Comienza agregando materiales';
    }

    const list = data.results;
    list.forEach((material) => {
      template += `
        <div class="card">
            <a href="material-by-id.html">
            <div class="card-container">
                <img src="../uploads/${material.imagen}" alt="img-1" />
            </div>
            </a>
            
            <div class="contenido-card">
              <p>${material.nombre}</p>
            </div>
        </div>
        `;

      listadoMateriales.innerHTML = template;
    });
  };

  // Petición inicial a MySQL para obtener los datos
  window.electronAPI.executeQuery('SELECT * FROM material', (error, data) => {
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
  nombre.value = '';
  cantidad.value = '';
  volumen.value = '';
  unidad.value = '';
  imagen.value = '';
};
