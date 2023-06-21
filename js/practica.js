let btnform = document.getElementById('btnform');
let nombre = document.getElementById('nombre');
let fecha = document.getElementById('fecha');
let subtitle = document.getElementById('subtitle');
let tablePracticas = document.getElementById('table-practicas');
const listaMaterialesSeleccionados = [];
const selectMateriales = document.getElementById('materiales');

const materiales = [];

window.addEventListener('DOMContentLoaded', () => {
  // Obtiene los elementos del formulario
  const inputCantidad = document.getElementById('cantidad');
  const btnAgregarMaterial = document.getElementById('agregarMaterial');
  const btnGuardar = document.getElementById('btnform');

  // Genera las opciones para los materiales
  materiales.forEach((material) => {
    const option = document.createElement('option');
    option.value = material.id;
    option.textContent = `${material.nombre} (${material.cantidad})`; // Agrega la cantidad al lado del nombre
    selectMateriales.appendChild(option);
  });

  // Event listener para el botón "Agregar Material"
  btnAgregarMaterial.addEventListener('click', () => {
    const selectedMaterial = selectMateriales.value;
    const cantidad = inputCantidad.value;

    // Validar que se haya seleccionado un material y se haya ingresado una cantidad
    if (selectedMaterial && cantidad) {
      const materialSeleccionado = {
        id: selectedMaterial,
        cantidad: parseInt(cantidad),
      };

      listaMaterialesSeleccionados.push(materialSeleccionado);

      // Limpiar campos de selección de material y cantidad
      selectMateriales.value = '';
      inputCantidad.value = '';

      // Opcional: Puedes mostrar en pantalla los materiales seleccionados en una lista o tabla
      console.log(listaMaterialesSeleccionados);
    } else {
      alert('Por favor, selecciona un material y especifica la cantidad.');
    }
  });

  // Event listener para el botón "Guardar"
  btnGuardar.addEventListener('click', () => {
    // Validar que se hayan seleccionado materiales y se haya ingresado un nombre de práctica
    const nombrePractica = document.getElementById('nombre').value;

    if (nombrePractica && listaMaterialesSeleccionados.length > 0) {
      // Lógica adicional para guardar la práctica con los materiales seleccionados y su cantidad
      // Aquí puedes realizar la lógica necesaria para guardar los datos o mostrar algún mensaje de confirmación

      // Limpiar campos y variables
      document.getElementById('nombre').value = '';
      selectMateriales.value = '';
      inputCantidad.value = '';
      listaMaterialesSeleccionados.length = 0;

      // Opcional: Puedes actualizar la lista de prácticas mostrada en la tabla
      console.log('Práctica guardada correctamente.');
    } else {
      alert(
        'Por favor, ingresa un nombre de práctica y selecciona al menos un material.'
      );
    }
  });

  window.electronAPI.executeQuery('SELECT * FROM material', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateMateriales(data);
    }
  });

  // window.electronAPI.executeQuery('SELECT * FROM practica', (error, data) => {
  //   if (error) {
  //     console.error('Error al ejecutar la consulta:', error);
  //   } else {
  //     updateTable(data);
  //   }
  // });

  window.electronAPI.receiveQueryResult((event, data) => {
    const example = [...data];

    updateTable(example);
    updateMateriales(example);
    // updateTable(data);
    // updateMateriales(data);
  });
});

// TODO: Example
const updateMateriales = (data) => {
  console.log('data - >', data);

  materiales.length = 0; // Vaciar el arreglo de materiales existente
  materiales.push(...data.results); // Agregar los datos de la consulta al arreglo materiales

  // Limpiar las opciones existentes en el select de materiales
  selectMateriales.innerHTML = '';

  // Generar las opciones para los materiales obtenidos de la base de datos
  materiales.forEach((material) => {
    const option = document.createElement('option');
    option.value = material.id;
    option.textContent = `${material.nombre} (${material.cantidad})`; // Agrega la cantidad al lado del nombre
    selectMateriales.appendChild(option);
  });
};

const updateTable = (data) => {
  let mylist = document.getElementById('mylist');
  let template = '';

  subtitle.textContent = '';
  tablePracticas.style.display = '';

  if (data.results.length === 0) {
    subtitle.textContent = 'Comienza creando una práctica';
    tablePracticas.style.display = 'none';
  }

  const list = data.results;
  list.forEach((element) => {
    // Parsear la fecha
    const fecha = new Date(element.fecPract);

    // Obtener los componentes de la fecha
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const day = fecha.getDate();

    // Formatear la fecha en el formato deseado (por ejemplo, DD/MM/YYYY)
    const formattedDate = `${day}/${month}/${year}`;

    template += `
    <tr>
       <td class="centrado">${element.nomPract}</td>
       <td class="centrado">${formattedDate}</td>
       <td class="centrado">
         <ul>`;

    // Agregar los materiales y su cantidad en una lista
    listaMaterialesSeleccionados.forEach((material) => {
      template += `<li>${material.nombre} (${material.cantidad})</li>`;
    });

    template += `
         </ul>
       </td>
       <td class="centrado">
         <button class="btn btn-danger" value="${element.idPract}">
           Eliminar
         </button>
       </td>
    </tr>
 `;
  });

  mylist.innerHTML = template;

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
  const fechaValue = fecha.value.trim();

  if (nombreValue === '' || fechaValue === '') {
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
    fecha: fecha.value,
  };

  const result = await window.electronAPI.addPractica(objPractica);
  // console.log('Práctica agregada correctamente:', result);

  // Limpiar todos los campos
  clearInput();

  // Petición a MySQL para obtener los datos actualizados
  window.electronAPI.executeQuery('SELECT * FROM practica', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Actualizar la tabla con los nuevos datos
    }
  });
};

const clearInput = () => {
  nombre.value = '';
  fecha.value = '';
};

const deletePractica = async (practicaId) => {
  // await window.electronAPI.deletePractica(practicaId);
  const result = await window.electronAPI.deletePractica(practicaId);
  // console.log('Practica eliminada correctamente:', result);

  // Petición a MySQL para obtener los datos actualizados
  window.electronAPI.executeQuery('SELECT * FROM practica', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Actualizar la tabla con los nuevos datos
    }
  });
};
