let mylist = document.getElementById('mylist');
let idreactivo = document.getElementById('idreactivo');
let nombre = document.getElementById('nombre');
let formula = document.getElementById('formula');
let cantidad = document.getElementById('cantidad');
let azul = document.getElementById('azul');
let rojo = document.getElementById('rojo');
let amarillo = document.getElementById('amarillo');
let blanco = document.getElementById('blanco');
let btnform = document.getElementById('btnform');
let btnUpdate = document.getElementById('btnUpdate');

window.addEventListener('DOMContentLoaded', () => {
  const updateTable = (data) => {
    let mylist = document.getElementById('mylist');
    let template = '';
    const list = data.results;
    list.forEach((element) => {
      template += `
         <tr>
            <td class="centrado">${element.nombre}</td>
            <td class="centrado">${element.formula}</td>
            <td class="centrado">${element.cantidad}</td>
            <td class="centrado" style="background-color: Blue" style="color: black">${element.azul}</td>
            <td class="centrado"style="background-color: red">${element.rojo}</td>
            <td class="centrado" style="background-color: yellow; color: black;">${element.amarillo}</td>
            <td class="centrado">${element.blanco}</td>
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

const isValidForm = () => {
  const nombreValue = nombre.value.trim();
  const cantidadValue = cantidad.value.trim();
  const blancoValue = blanco.value.trim();
  const amarilloValue = amarillo.value.trim();
  const rojoValue = rojo.value.trim();
  const azulValue = azul.value.trim();
  const formulaValue = formula.value.trim();

  if (
    nombreValue === '' ||
    formulaValue === ' ' ||
    cantidadValue === '' ||
    azulValue === '' ||
    rojoValue === '' ||
    amarilloValue === '' ||
    blancoValue === ''
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

const addProductRenderer = () => {
  const objReactivo = {
    nombre: nombre.value,
    formula: formula.value,
    cantidad: cantidad.value,
    azul: parseInt(azul.value),
    rojo: parseInt(rojo.value),
    amarillo: parseInt(amarillo.value),
    blanco: blanco.value,
  };
  console.log('objReactivo ->', objReactivo);

  const result = window.electronAPI.addReactivo(objReactivo);
  console.log('Reactivo agregado correctamente:', result);

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
  idreactivo.value = '';
  nombre.value = '';
  formula.value = '';
  cantidad.value = '';
  azul.value = '';
  rojo.value = '';
  amarillo.value = '';
  blanco.value = '';
};
