document.addEventListener('DOMContentLoaded', async () => {
  const materialId = getMaterialIdFromURL(); // Obtén el ID del material de la URL actual

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

  //   const idElement = document.getElementById('material-id');
  //   idElement.textContent = material.id;

  const nombreElement = document.getElementById('material-nombre');
  nombreElement.textContent = material.nombre;

  const cantidadElement = document.getElementById('material-cantidad');
  cantidadElement.textContent = material.cantidad;

  const volumenElement = document.getElementById('material-volumen');
  volumenElement.textContent = material.volumen;

  const unidadElement = document.getElementById('material-unidad');
  unidadElement.textContent = material.unidad;

  const imagenElement = document.getElementById('material-imagen');
  imagenElement.src = `../uploads/${material.imagen}`;
}
