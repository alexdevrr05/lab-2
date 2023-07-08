document.addEventListener('DOMContentLoaded', async () => {
  const practicaId = getMaterialIdFromURL();

  const linkElement = document.querySelector('#update-button');
  linkElement.href = `practica-update.html?id=${practicaId}`;

  try {
    const practica = await window.electronAPI.showPractica(practicaId);
    displayPractica(practica);
  } catch (error) {
    console.error('Error al obtener los datos del practica:', error);
  }
});

function getMaterialIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const practicaId = urlParams.get('id');
  return practicaId;
}

function displayPractica(practica) {
  // date format
  let formattedDate;
  if (practica.fecPract) {
    const fecha = new Date(practica.fecPract);
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1;
    const day = fecha.getDate();
    formattedDate = `${day}/${month}/${year}`;
  }

  const nombreElement = document.getElementById('practica-nombre');
  nombreElement.textContent = practica.nomPract;

  const fechaElement = document.getElementById('practica-fecha');
  fechaElement.textContent = formattedDate;

  const descElement = document.getElementById('practica-desc');
  descElement.textContent = practica.descPract ? practica.descPract : 'none';

  const imagenElement = document.getElementById('practica-imagen');
  imagenElement.src = `../uploads/${practica.imagen}`;
}
