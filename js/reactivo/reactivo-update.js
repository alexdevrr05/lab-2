document.addEventListener('DOMContentLoaded', async () => {
  const reactivoId = getReactivoIdFromURL(); // Obtén el ID del material de la URL actual

  try {
    const reactivo = await window.electronAPI.showReactivo(reactivoId);
    displayReactivoInfo(reactivo);
  } catch (error) {
    console.error('Error al obtener los datos del material:', error);
  }
});

const btnUpdate = document.getElementById('btn-update');
btnUpdate.addEventListener('click', updateMaterial);

function getReactivoIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const reactivoId = urlParams.get('id');
  return reactivoId;
}

function displayReactivoInfo(reactivo) {
  const gruposInput = document.getElementById('reactivo-grupos');
  const nombreInput = document.getElementById('reactivo-nombre');
  const cantidadInput = document.getElementById('reactivo-cantidad');
  const unidadInput = document.getElementById('reactivo-unidad');
  const azulInput = document.getElementById('reactivo-azul');
  const rojoInput = document.getElementById('reactivo-rojo');
  const amarilloInput = document.getElementById('reactivo-amarillo');
  const blancoInput = document.getElementById('reactivo-blanco');
  const piezasInput = document.getElementById('reactivo-piezas');

  gruposInput.value = reactivo.grupos ? reactivo.grupos : null;
  nombreInput.value = reactivo.nombre ? reactivo.nombre : null;
  cantidadInput.value = reactivo.cantidad ? reactivo.cantidad : null;
  unidadInput.value = reactivo.unidad ? reactivo.unidad : null;
  azulInput.value = reactivo.cod_azul;
  rojoInput.value = reactivo.cod_rojo;
  amarilloInput.value = reactivo.cod_amarillo;
  blancoInput.value = reactivo.cod_blanco;
  piezasInput.value = reactivo.piezas;
}

async function updateMaterial() {
  const reactivoId = getReactivoIdFromURL(); // Obtén el ID del material de la URL actual

  // Obtener los valores actualizados de los campos
  const grupos = document.getElementById('reactivo-grupos').value;
  const nombre = document.getElementById('reactivo-nombre').value;
  const cantidad = document.getElementById('reactivo-cantidad').value;
  const unidad = document.getElementById('reactivo-unidad').value;
  const cod_azul = document.getElementById('reactivo-azul').value;
  const cod_rojo = document.getElementById('reactivo-rojo').value;
  const cod_amarillo = document.getElementById('reactivo-amarillo').value;
  const cod_blanco = document.getElementById('reactivo-blanco').value;
  const piezas = document.getElementById('reactivo-piezas').value;

  // Construir el objeto material con los nuevos valores
  const updatedReactivo = {
    id: reactivoId,
    grupos,
    nombre,
    cantidad,
    unidad,
    cod_azul: cod_azul === '' ? 0 : cod_azul,
    cod_rojo: cod_rojo === '' ? 0 : cod_rojo,
    cod_amarillo: cod_amarillo === '' ? 0 : cod_amarillo,
    cod_blanco: cod_blanco === '' ? 0 : cod_blanco,
    piezas,
  };

  try {
    // Llamar a la función de actualización del reactivo en el backend
    await window.electronAPI.updatedReactivo(updatedReactivo);
    alert('Reactivo actualizado correctamente');
    // Redirigir a la página de visualización del reactivo actualizado
    window.location.href = `reactivo.html`;
  } catch (error) {
    console.error('Error al actualizar el reactivo:', error);
    alert(
      'Error al actualizar el reactivo. Consulta la consola para más detalles.'
    );
  }
}
