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
  materiales.forEach((material) => {
    const option = document.createElement('option');
    option.value = material.id;
    option.textContent = `${material.nombre} (${material.cantidad})`; // Agrega la cantidad al lado del nombre
    selectMateriales.appendChild(option);
  });

  // Event listener para el botón "Agregar Material"
  // btnAgregarMaterial.addEventListener('click', () => {
  //   const selectedMaterial = selectMateriales.value;
  //   const cantidad = inputCantidad.value;

  //   // Validar que se haya seleccionado un material y se haya ingresado una cantidad
  //   if (selectedMaterial && cantidad) {
  //     const materialSeleccionado = {
  //       id: selectedMaterial,
  //       cantidad: parseInt(cantidad),
  //     };

  //     // Validar si la cantidad ingresada excede la cantidad disponible del material
  //     const materialDisponible = materiales.find(
  //       (material) => material.id == selectedMaterial
  //     );

  //     if (
  //       materialDisponible &&
  //       materialSeleccionado.cantidad > materialDisponible.cantidad
  //     ) {
  //       alert(
  //         'La cantidad ingresada supera la cantidad disponible del material.'
  //       );
  //       return; // Detener el flujo del programa si la validación no se cumple
  //     }

  //     listaMaterialesSeleccionados.push(materialSeleccionado);
  //     // console.log('materialSeleccionado:', materialSeleccionado);

  //     // Limpiar campos de selección de material y cantidad
  //     selectMateriales.value = '';
  //     inputCantidad.value = '';
  //   } else {
  //     alert('Por favor, selecciona un material y especifica la cantidad.');
  //   }
  // });

  // Event listener para el botón "Guardar"
  btnGuardar.addEventListener('click', () => {
    // Validar que se hayan seleccionado materiales y se haya ingresado un nombre de práctica
    if (listaMaterialesSeleccionados.length === 0) {
      alert(
        'Por favor, ingresa un nombre de práctica y selecciona al menos un material.'
      );
    }
  });

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

// const updateMateriales = (data) => {
//   materiales.length = 0; // Vaciar el arreglo de materiales existente

//   data.map((material) => {
//     materiales.push(material);
//   });

//   // Limpiar las opciones existentes en el select de materiales
//   selectMateriales.innerHTML = '';

//   // Generar las opciones para los materiales obtenidos de la base de datos
//   materiales.forEach((material) => {
//     const option = document.createElement('option');
//     option.value = material.id;
//     option.textContent = `${material.nombre} (${material.cantidad})`; // Agrega la cantidad al lado del nombre
//     selectMateriales.appendChild(option);
//   });
// };

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

    // const materialesPractica = await getMaterialesPractica(element.idPract);

    // materialesPractica.forEach((material) => {
    //   template += `<li>${material.nombre} (${material.cantidad})</li>`;
    // });

    // template += `
    //       </ul>
    //     </td>
    //     <td class="centrado">${element.descPract}</td>
    //     <td class="centrado">
    //       <button class="btn btn-info" value="${element.idPract}">
    //         Editar
    //       </button>
    //     </td>
    //     <td class="centrado">
    //       <button class="btn btn-danger" value="${element.idPract}">
    //         Eliminar
    //       </button>
    //     </td>
    //   </tr>`;
  }

  listadoPracticas.innerHTML = template;

  const deleteButtons = document.querySelectorAll('.btn.btn-danger');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', handleDelete);
  });
};

const handleDelete = (event) => {
  const practicaId = event.target.value;
  deletePractica(practicaId);
};

// Validar que los campos no vengan vacíos
const isValidForm = () => {
  const nombreValue = nombre.value.trim();
  const descripcionValue = descripcion.value.trim();
  // const cantidadValue = cantidad.value.trim();
  const fechaValue = fecha.value.trim();

  if (nombreValue === '' || fechaValue === '' || descripcionValue === '') {
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
  };

  if (listaMaterialesSeleccionados.length > 0) {
    const practicaId = await window.electronAPI.addPractica(objPractica);

    const values = {};

    listaMaterialesSeleccionados.forEach((material) => {
      values[material.id] = {
        practicaId: practicaId,
        materialId: material.id,
        cantidad: material.cantidad,
      };
    });

    await window.electronAPI.addPracticaMateriales({ 0: values }); // Enviar los valores dentro de un objeto con clave '0'

    clearInput();
    listaMaterialesSeleccionados = [];

    window.electronAPI.executeQueries(
      // ['SELECT * FROM practicas', 'SELECT * FROM materiales'],
      ['SELECT * FROM practicas'],
      (error, data) => {
        if (error) {
          console.error('Error al ejecutar la consulta:', error);
        } else {
          const [result1, result2] = data;
          updateTable(result1);
          // updateMateriales(result2);
        }
      }
    );
  }
};

const clearInput = () => {
  nombre.value = '';
  fecha.value = '';
  descripcion.value = '';
  cantidad.value = '';
};

const deletePractica = async (practicaId) => {
  await window.electronAPI.deletePractica(practicaId);
  // console.log('Practica eliminada correctamente:', result);

  // Petición a MySQL para obtener los datos actualizados
  window.electronAPI.executeQuery('SELECT * FROM practicas', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Actualizar la tabla con los nuevos datos
    }
  });
};

const getMaterialesPractica = async (idPractica) => {
  try {
    const materialesPractica = await window.electronAPI.getMaterialesPractica(
      idPractica
    );
    return materialesPractica; // Accede al resultado correctamente
  } catch (error) {
    console.error('Error al obtener los materiales de la práctica:', error);
    return [];
  }
};
