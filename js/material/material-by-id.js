document.addEventListener('DOMContentLoaded', async () => {
  const materialId = getMaterialIdFromURL(); // Obtén el ID del material de la URL actual

  const linkElement = document.querySelector('#update-button');
  linkElement.href = `material-update.html?id=${materialId}`;

  try {
    const material = await window.electronAPI.showMaterial(materialId);
    displayMaterial(material);
  } catch (error) {
    console.error('Error al obtener los datos del material:', error);
  }
});

function getMaterialIdFromURL() {
  // Si la URL tiene el formato "material-by-id.html?id=123",
  // obtenemos el ID así:
  const urlParams = new URLSearchParams(window.location.search);
  const materialId = urlParams.get('id');
  return materialId;
}

function displayMaterial(material) {
  // Accede a las propiedades del material y actualiza los elementos HTML correspondientes

  const clasificacionElement = document.getElementById(
    'material-clasificacion'
  );
  clasificacionElement.textContent = material.clasificacion;

  const nombreElement = document.getElementById('material-nombre');
  nombreElement.textContent = material.nombre;

  const cantidadElement = document.getElementById('material-cantidad');
  cantidadElement.textContent = material.cantidad ? material.cantidad : 'null';

  const volumenElement = document.getElementById('material-tamanio');
  volumenElement.textContent = material.tamanio;

  const unidadElement = document.getElementById('material-unidad');
  unidadElement.textContent = material.unidades;

  const imagenElement = document.getElementById('material-imagen');
  imagenElement.src = `../uploads/${material.imagen}`;

  const caractElement = document.getElementById('material-caract_esp');
  caractElement.textContent = material.caract_esp
    ? material.caract_esp
    : 'none';
}
