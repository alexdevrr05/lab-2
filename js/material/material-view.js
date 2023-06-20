let title = document.getElementById('title');

window.addEventListener('DOMContentLoaded', () => {
  const updateTable = (data) => {
    let listadoMateriales = document.getElementById('listado-materiales');
    let template = '';
    title.textContent = 'Todos los materiales';

    if (data.results.length === 0) {
      title.textContent = 'Comienza agregando materiales';
    }

    console.log(data.results);
    const list = data.results;
    list.forEach((material) => {
      template += `
        <div class="card">
            <a href="lista-materiales.html">
            <div class="card-container">
                <img src="../uploads/${material.imagen}" alt="img-1" />
            </div>
            </a>
            
            <div class="contenido-card">
            <p>${material.nombre}</p>
            </div>
        </div>
        `;

      listadoMateriales.innerHTML = template;
    });
  };

  // Petición inicial a MySQL para obtener los datos
  window.electronAPI.executeQuery('SELECT * FROM material', (error, data) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
    } else {
      updateTable(data); // Mostrar los resultados iniciales
    }
  });

  window.electronAPI.receiveQueryResult((event, data) => {
    updateTable(data);
  });
});
