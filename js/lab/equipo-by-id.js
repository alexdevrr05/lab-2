document.addEventListener('DOMContentLoaded', async () => {
  const equipoId = getMaterialIdFromURL(); // Obtén el ID del material de la URL actual

  const linkElement = document.querySelector('#update-button');
  linkElement.href = `equipo-update.html?id=${equipoId}`;

  try {
    const equipo = await window.electronAPI.showEquipo(equipoId);
    displayEquipo(equipo);
  } catch (error) {
    console.error('Error al obtener los datos del equipo:', error);
  }
});

function getMaterialIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const equipoId = urlParams.get('id');
  return equipoId;
}

function displayEquipo(equipo) {
  const nombreElement = document.getElementById('equipo-nombre');
  nombreElement.textContent = equipo.nombre;

  const cantidadElement = document.getElementById('equipo-cantidad');
  cantidadElement.textContent = equipo.cantidad ? equipo.cantidad : 'null';

  const practicaElement = document.getElementById('equipo-practica');
  practicaElement.textContent = equipo.practica ? equipo.practica : 'null';

  const materialElement = document.getElementById('equipo-material');
  materialElement.textContent = equipo.material ? equipo.material : 'null';

  const unidadesElement = document.getElementById('equipo-unidades');
  unidadesElement.textContent = equipo.unidades ? equipo.unidades : 'null';

  const imagenElement = document.getElementById('equipo-imagen');
  imagenElement.src = `../uploads/${equipo.imagen}`;
}
