document.addEventListener('DOMContentLoaded', async () => {
  const reactivoId = getMaterialIdFromURL();

  const linkElement = document.querySelector('#update-button');
  linkElement.href = `reactivo-update.html?id=${reactivoId}`;

  try {
    const reactivo = await window.electronAPI.showReactivo(reactivoId);
    displayReactivo(reactivo);
  } catch (error) {
    console.error('Error al obtener los datos del equipo:', error);
  }
});

function getMaterialIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const reactivoId = urlParams.get('id');
  return reactivoId;
}

function displayReactivo(reactivo) {
  const gruposElement = document.getElementById('reactivo-grupos');
  const nombreElement = document.getElementById('reactivo-nombre');
  const cantidadElement = document.getElementById('reactivo-cantidad');
  const unidadElement = document.getElementById('reactivo-unidad');
  const cod_azulElement = document.getElementById('reactivo-cod_azul');
  const cod_rojoElement = document.getElementById('reactivo-cod_rojo');
  const cod_amarilloElement = document.getElementById('reactivo-cod_amarillo');
  const cod_blancoElement = document.getElementById('reactivo-cod_blanco');
  const piezasElement = document.getElementById('reactivo-piezas');
  const imagenElement = document.getElementById('reactivo-imagen');
  imagenElement.src = `../uploads/${reactivo.imagen}`;

  nombreElement.textContent = reactivo.nombre ? reactivo.nombre : '';
  gruposElement.textContent = reactivo.grupos ? reactivo.grupos : '';
  cantidadElement.textContent = reactivo.cantidad ? reactivo.cantidad : '';
  unidadElement.textContent = reactivo.unidad ? reactivo.unidad : '';
  cod_azulElement.textContent = reactivo.cod_azul;
  cod_rojoElement.textContent = reactivo.cod_rojo;
  cod_amarilloElement.textContent = reactivo.cod_amarillo;
  cod_blancoElement.textContent = reactivo.cod_blanco;
  piezasElement.textContent = reactivo.piezas ? reactivo.piezas : '';

  //   nombreElement.textContent = reactivo.nombre;
}
