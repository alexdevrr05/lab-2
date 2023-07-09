let btnGuardar = document.getElementById('btnform');

let nombre = document.getElementById('nombre');
let descripcion = document.getElementById('descripcion');
let fecha = document.getElementById('fecha');
let cantidad = document.getElementById('cantidad');

// let tablePracticas = document.getElementById('table-practicas');

let listadoPracticas = document.getElementById('listado-practicas');
let title = document.getElementById('title');

let listaMaterialesSeleccionados = [];
const selectMateriales = document.getElementById('materiales');

const materiales = [];

window.addEventListener('DOMContentLoaded', () => {
  // Obtiene los elementos del formulario
  // const inputCantidad = document.getElementById('cantidad');
  // const btnAgregarMaterial = document.getElementById('agregarMaterial');

  // Genera las opciones para los materiales
  // materiales.forEach((material) => {
  //   const option = document.createElement('option');
  //   option.value = material.id;
  //   option.textContent = `${material.nombre} (${material.cantidad})`; // Agrega la cantidad al lado del nombre
  //   selectMateriales.appendChild(option);
  // });

  // Event listener para el botón "Guardar"

  // TODO: HERE
  // btnGuardar.addEventListener('click', () => {
  //   // Validar que se hayan seleccionado materiales y se haya ingresado un nombre de práctica
  //   if (listaMaterialesSeleccionados.length === 0) {
  //     alert(
  //       'Por favor, ingresa un nombre de práctica y selecciona al menos un material.'
  //     );
  //   }
  // });

  window.electronAPI.executeQueries(
    ['SELECT * FROM practicas'],
    (error, data) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
      } else {
        // const [result1, result2] = data;
        const [result1] = data;
        updateTable(result1);
        // updateMateriales(result2);
      }
    }
  );

  window.electronAPI.receiveQueriesResults((event, data) => {
    // const [result1, result2] = data; // Obtener las respuestas individuales
    const [result1] = data;

    updateTable(result1);
    // updateMateriales(result2);
  });

  window.electronAPI.receiveQueryResult((event, data) => {
    updateTable(data);
  });
});

const updateTable = async (data) => {
  // let mylist = document.getElementById('mylist');
  let template = '';

  title.textContent = 'Todas las prácticas';

  listadoPracticas.style.display = '';

  if (data.length === 0) {
    title.textContent = 'Comienza creando una práctica';
    listadoPracticas.style.display = 'none';
  }

  for (const element of data) {
    template += `
    <div class="card">
        <a href="practica-by-id.html?id=${element.idPract}">
        <div class="card-container">
            <img src="../uploads/${element.imagen}" alt="img-${element.idPract}" />
        </div>
        </a>
        
        <div class="contenido-card">
          <p>${element.nomPract}</p>
          <button class="btn btn-danger btn-sm delete" value="${element.idPract}" data-imagen="${element.imagen}">Eliminar</button>
        </div>
    </div>
    `;
  }

  listadoPracticas.innerHTML = template;

  const deleteButtons = document.querySelectorAll('.btn.btn-danger');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', handleDelete);
  });
};

const handleDelete = (event) => {
  const practicaId = event.target.value;
  const imagenName = event.target.getAttribute('data-imagen');
  deletePractica(practicaId, imagenName);
};

// Validar que los campos no vengan vacíos
const isValidForm = () => {
  const nombreValue = nombre.value.trim();
  const descripcionValue = descripcion.value.trim();
  const fechaValue = fecha.value.trim();
  const imgValue = imagen.value.trim();

  if (
    nombreValue === '' ||
    fechaValue === '' ||
    descripcionValue === '' ||
    imgValue === ''
  ) {
    alert('Por favor, completa todos los campos');
    return false;
  }

  return true;
};

const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
  event.preventDefault(); // Evita la acción por defecto del formulario
  if (isValidForm()) {
    addPracticaRenderer();
  }
});

btnform.addEventListener('click', async () => {
  if (isValidForm()) {
    addPracticaRenderer();
  }
});

const addPracticaRenderer = async () => {
  const objPractica = {
    nombre: nombre.value,
    descripcion: descripcion.value,
    fecha: fecha.value,
    imagen: imagen.files[0].path,
  };

  await window.electronAPI.addPractica(objPractica);
  clearInput();

  window.electronAPI.executeQuery('SELECT * FROM practicas', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data);
    }
  });
};

const clearInput = () => {
  nombre.value = '';
  fecha.value = '';
  descripcion.value = '';
  imagen.value = '';
};

const deletePractica = async (practicaId, imagenName) => {
  await window.electronAPI.deletePractica(practicaId, imagenName);
  // Petición a MySQL para obtener los datos actualizados
  window.electronAPI.executeQuery('SELECT * FROM practicas', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Actualizar la tabla con los nuevos datos
    }
  });
};

// const getMaterialesPractica = async (idPractica) => {
//   try {
//     const materialesPractica = await window.electronAPI.getMaterialesPractica(
//       idPractica
//     );
//     return materialesPractica; // Accede al resultado correctamente
//   } catch (error) {
//     console.error('Error al obtener los materiales de la práctica:', error);
//     return [];
//   }
// };
