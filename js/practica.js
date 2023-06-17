let btnform = document.getElementById('btnform');
let nombre = document.getElementById('nombre');
let fecha = document.getElementById('fecha');

window.addEventListener('DOMContentLoaded', () => {
  window.electronAPI.executeQuery('SELECT * FROM practica', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data);
    }
  });

  window.electronAPI.receiveQueryResult((event, data) => {
    updateTable(data);
  });
});

const updateTable = (data) => {
  let mylist = document.getElementById('mylist');
  let template = '';

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
  mylist.innerHTML = template;
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
  console.log('Práctica agregada correctamente:', result);

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
