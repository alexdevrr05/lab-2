document.addEventListener('DOMContentLoaded', async () => {
  const practicaId = getMaterialIdFromURL();

  try {
    const practicas = await window.electronAPI.showPractica(practicaId);
    displayPractica(practicas);
  } catch (error) {
    console.error('Error al obtener los datos de las practicas:', error);
  }
});

const btnUpdate = document.getElementById('btn-update');
btnUpdate.addEventListener('click', updatePractica);

function getMaterialIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const practicaId = urlParams.get('id');
  return practicaId;
}

function displayPractica(practica) {
  const equipoImagen = document.getElementById('img-practica');

  const nombreInput = document.getElementById('practica-nombre');
  const fechaInput = document.getElementById('practica-fecha');
  const descripcionInput = document.getElementById('practica-desc');

  equipoImagen.src = `../uploads/${practica.imagen}`;

  nombreInput.value = practica.nomPract ? practica.nomPract : null;
  //   fechaInput.value = practica.fecPract;
  fechaInput.value = practica.fecPract.toISOString().substring(0, 10);

  descripcionInput.value = practica.descPract ? practica.descPract : null;
}

async function updatePractica() {
  const practicaId = getMaterialIdFromURL();

  // Obtener los valores actualizados de los campos
  const nombre = document.getElementById('practica-nombre').value;
  const fecha = document.getElementById('practica-fecha').value;
  const descripcion = document.getElementById('practica-desc').value;

  // Construir el objeto material con los nuevos valores
  const updatedPractica = {
    idPract: practicaId,
    nombre,
    fecha,
    descripcion,
  };

  const imageInput = document.getElementById('practica-imagen');
  if (imageInput.files.length > 0) {
    const imageFile = imageInput.files[0];
    try {
      // Envía la imagen al servidor para guardarla en el directorio de imágenes
      await window.electronAPI.uploadPracticaImage(imageFile, practicaId);
      updatedPractica.imagen = `uploads/${practicaId}.jpg`;
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
    }
  }

  try {
    await window.electronAPI.updatePractica(updatedPractica);
    alert('Práctica actualizada correctamente');

    window.location.href = `practica-by-id.html?id=${practicaId}`;
  } catch (error) {
    console.error('Error al actualizar la practica:', error);
    alert('Error al actualizar la practica');
  }
}
