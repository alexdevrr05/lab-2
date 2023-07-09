document.addEventListener('DOMContentLoaded', async () => {
  const materialId = getMaterialIdFromURL(); // Obtén el ID del material de la URL actual

  try {
    const material = await window.electronAPI.showMaterial(materialId);
    displayMaterial(material);
  } catch (error) {
    console.error('Error al obtener los datos del material:', error);
  }
});

// Con este botón tienes que actualizar el registro
const btnUpdate = document.getElementById('btn-update');
btnUpdate.addEventListener('click', updateMaterial);

function getMaterialIdFromURL() {
  // Si la URL tiene el formato "material-by-id.html?id=123",
  // obtenemos el ID así:
  const urlParams = new URLSearchParams(window.location.search);
  const materialId = urlParams.get('id');
  return materialId;
}

function displayMaterial(material) {
  const materialImagen = document.getElementById('img-material');
  const nombreInput = document.getElementById('material-nombre');
  const clasificacionInput = document.getElementById('material-clasificacion');
  const cantidadInput = document.getElementById('material-cantidad');
  const tamanioInput = document.getElementById('material-tamanio');
  const unidadesInput = document.getElementById('material-unidades');
  const caractEspTextArea = document.getElementById('material-caract_esp');
  materialImagen.src = `../uploads/${material.imagen}`;

  // Actualizar los valores de los campos
  nombreInput.value = material.nombre ? material.nombre : null;
  clasificacionInput.value = material.clasificacion
    ? material.clasificacion
    : null;
  cantidadInput.value = material.cantidad ? material.cantidad : null;
  tamanioInput.value = material.tamanio ? material.tamanio : null;
  unidadesInput.value = material.unidades ? material.unidades : null;
  caractEspTextArea.value = material.caract_esp ? material.caract_esp : null;
}

async function updateMaterial() {
  const materialId = getMaterialIdFromURL(); // Obtén el ID del material de la URL actual

  // Obtener los valores actualizados de los campos
  const nombre = document.getElementById('material-nombre').value;
  const clasificacion = document.getElementById('material-clasificacion').value;
  const cantidad = document.getElementById('material-cantidad').value || 0;
  const tamanio = document.getElementById('material-tamanio').value;
  const unidades = document.getElementById('material-unidades').value;
  const caractEsp = document.getElementById('material-caract_esp').value;

  // Construir el objeto material con los nuevos valores
  const updatedMaterial = {
    id: materialId,
    clasificacion: clasificacion,
    nombre: nombre,
    cantidad: cantidad,
    tamanio: tamanio,
    unidades: unidades,
    caract_esp: caractEsp,
  };

  // Si se ha seleccionado un archivo de imagen
  const imageInput = document.getElementById('material-imagen');
  if (imageInput.files.length > 0) {
    const imageFile = imageInput.files[0];
    try {
      console.log('into here');
      // Envía la imagen al servidor para guardarla en el directorio de imágenes
      await window.electronAPI.uploadMaterialImage(imageFile, materialId);
      // Actualiza la URL de la imagen del material
      updatedMaterial.imagen = `uploads/${materialId}.jpg`;
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
    }
  }

  try {
    // Llamar a la función de actualización del material en el backend
    await window.electronAPI.updateMaterial(updatedMaterial);
    alert('Material actualizado correctamente');
    // Redirigir a la página de visualización del material actualizado
    window.location.href = `material-view.html?id=${materialId}`;
  } catch (error) {
    console.error('Error al actualizar el material:', error);
    alert(
      'Error al actualizar el material. Consulta la consola para más detalles.'
    );
  }
}
