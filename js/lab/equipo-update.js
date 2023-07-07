document.addEventListener('DOMContentLoaded', async () => {
  const equipoId = getMaterialIdFromURL(); // Obtén el ID del material de la URL actual

  try {
    const equipos = await window.electronAPI.showEquipo(equipoId);
    displayEquipo(equipos);
  } catch (error) {
    console.error('Error al obtener los datos del equipos:', error);
  }
});

// Con este botón tienes que actualizar el registro
const btnUpdate = document.getElementById('btn-update');
btnUpdate.addEventListener('click', updateEquipo);

function getMaterialIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const equipoId = urlParams.get('id');
  return equipoId;
}

function displayEquipo(equipo) {
  const equipoImagen = document.getElementById('img-equipo');

  const nombreInput = document.getElementById('equipo-nombre');
  const cantidadInput = document.getElementById('equipo-cantidad');
  const practicaInput = document.getElementById('equipo-practica');
  const materialInput = document.getElementById('equipo-material');
  const unidadesInput = document.getElementById('equipo-unidades');

  equipoImagen.src = `../uploads/${equipo.imagen}`;

  // Actualizar los valores de los campos
  nombreInput.value = equipo.nombre ? equipo.nombre : null;
  cantidadInput.value = equipo.cantidad ? equipo.cantidad : null;
  practicaInput.value = equipo.practica ? equipo.practica : null;
  materialInput.value = equipo.material ? equipo.material : null;
  unidadesInput.value = equipo.unidades ? equipo.unidades : null;
}

async function updateEquipo() {
  const equipoId = getMaterialIdFromURL(); // Obtén el ID del material de la URL actual

  // Obtener los valores actualizados de los campos
  const nombre = document.getElementById('equipo-nombre').value;
  const cantidad = document.getElementById('equipo-cantidad').value;
  const practica = document.getElementById('equipo-practica').value;
  const material = document.getElementById('equipo-material').value;
  const unidades = document.getElementById('equipo-unidades').value;

  // Construir el objeto material con los nuevos valores
  const updatedEquipo = {
    id: equipoId,
    nombre,
    cantidad,
    practica,
    material,
    unidades,
  };

  const imageInput = document.getElementById('equipo-imagen');
  if (imageInput.files.length > 0) {
    const imageFile = imageInput.files[0];
    try {
      // Envía la imagen al servidor para guardarla en el directorio de imágenes
      await window.electronAPI.uploadEquipoImage(imageFile, equipoId);
      // Actualiza la URL de la imagen delequipo
      updatedEquipo.imagen = `uploads/${equipoId}.jpg`;
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
    }
  }

  try {
    // Llamar a la función de actualización del material en el backend
    await window.electronAPI.updateEquipo(updatedEquipo);
    alert('Material actualizado correctamente');
    // Redirigir a la página de visualización del material actualizado
    window.location.href = `equipo-by-id.html?id=${equipoId}`;
  } catch (error) {
    console.error('Error al actualizar el material:', error);
    alert(
      'Error al actualizar el material. Consulta la consola para más detalles.'
    );
  }
}
