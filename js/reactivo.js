let mylist = document.getElementById('mylist');

let grupos = document.getElementById('grupos');
let nombre = document.getElementById('nombre');
let cantidad = document.getElementById('cantidad');
let unidad = document.getElementById('unidad');
let azul = document.getElementById('azul');
let rojo = document.getElementById('rojo');
let amarillo = document.getElementById('amarillo');
let blanco = document.getElementById('blanco');
let piezas = document.getElementById('piezas');

let btnform = document.getElementById('btnform');
let subtitle = document.getElementById('subtitle');
let tablePracticas = document.getElementById('table-reactivos');

const botonBuscar = document.getElementById('boton-buscar');

window.addEventListener('DOMContentLoaded', () => {
  const updateTable = (data) => {
    let mylist = document.getElementById('mylist');

    subtitle.textContent = '';

    if (data.length === 0) {
      subtitle.textContent =
        'Comienza creando una práctica o no hay resultados de la búsqueda';
      tablePracticas.style.display = 'none';
    }

    let template = '';
    const list = data.reverse();
    list.forEach((element) => {
      template += `
         <tr>
            <td class="centrado">${element.grupos}</td>
            <td class="centrado">${element.nombre}</td>
            <td class="centrado">${element.cantidad}</td>
            <td class="centrado">${element.unidad}</td>
            <td class="centrado" style="background-color: Blue" style="color: black">${element.cod_azul}</td>
            <td class="centrado"style="background-color: red">${element.cod_rojo}</td>
            <td class="centrado" style="background-color: yellow; color: black;">${element.cod_amarillo}</td>
            <td class="centrado" style="background-color: white; color: black;">${element.cod_blanco}</td>
            <td class="centrado">${element.piezas}</td>
            <td class="centrado">
               <button class="btn btn-info" id="btnedit" value="${element.id}">
                Editar
              </button>
            </td>
            <td class="centrado">
              <button class="btn btn-danger" value="${element.id}">
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
    deleteReactivo(practicaId);
  };

  window.electronAPI.executeQuery('SELECT * FROM reactivos', (error, data) => {
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

botonBuscar.addEventListener('click', (event) => {
  event.preventDefault();
  handleBuscarReactivos();
});

const handleBuscarReactivos = async () => {
  const busquedaInput = document.getElementById('busqueda-input');
  const query = busquedaInput.value.trim();

  window.electronAPI.executeQuery(
    `SELECT * FROM reactivos WHERE nombre LIKE '%${query}%' OR grupos LIKE '%${query}%'`,
    (error, data) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
      } else {
        updateTable(data);
      }
    }
  );
};

const isValidForm = () => {
  const gruposValue = grupos.value.trim();
  const nombreValue = nombre.value.trim();
  const cantidadValue = cantidad.value.trim();
  const unidadValue = unidad.value.trim();
  const azulValue = azul.value.trim();
  const rojoValue = rojo.value.trim();
  const amarilloValue = amarillo.value.trim();
  const blancoValue = blanco.value.trim();
  const piezasValue = piezas.value.trim();

  if (
    gruposValue === '' ||
    nombreValue === '' ||
    cantidadValue === '' ||
    azulValue === '' ||
    rojoValue === '' ||
    unidadValue === '' ||
    amarilloValue === '' ||
    blancoValue === '' ||
    piezasValue === ''
  ) {
    alert('Por favor, completa todos los campos');
    return false;
  }

  return true;
};

btnform.addEventListener('click', async () => {
  if (isValidForm()) {
    addProductRenderer();
  }
});

const addProductRenderer = async () => {
  const objReactivo = {
    grupos: grupos.value,
    nombre: nombre.value,
    cantidad: cantidad.value,
    unidad: unidad.value,
    cod_azul: parseInt(azul.value),
    cod_rojo: parseInt(rojo.value),
    cod_amarillo: parseInt(amarillo.value),
    cod_blanco: parseInt(blanco.value),
    piezas: piezas.value,
  };
  // console.log('objReactivo ->', objReactivo);

  const result = await window.electronAPI.addReactivo(objReactivo);
  // console.log('Reactivo agregado correctamente:', result);

  clearInput();

  window.electronAPI.executeQuery('SELECT * FROM reactivos', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data);
    }
  });
};

const clearInput = () => {
  nombre.value = '';
  cantidad.value = '';
  azul.value = '';
  rojo.value = '';
  amarillo.value = '';
  blanco.value = '';
  piezas.value = '';
};

const deleteReactivo = async (reactivoId) => {
  await window.electronAPI.deleteReactivo(reactivoId);
  // const result = await window.electronAPI.deleteReactivo(reactivoId);
  // console.log('Reactivo eliminado correctamente:', result);

  // Petición a MySQL para obtener los datos actualizados
  window.electronAPI.executeQuery('SELECT * FROM reactivos', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Actualizar la tabla con los nuevos datos
    }
  });
};
