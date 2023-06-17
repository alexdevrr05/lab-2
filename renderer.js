// Proceso del navegador para enviar informacion node <-> navegador

window.addEventListener('DOMContentLoaded', () => {
  window.electronAPI.onUpdateTheme((event, theme) => {
    const root = document.documentElement;
    console.log(theme);
    root.style.setProperty('--scheme', theme);
  });

  // window.electronAPI.receiveQueryResult((event, result) => {
  //   console.log('Resultado de la consulta:', result);
  //   // Hacer algo con el resultado obtenido de la consulta
  // });

  // window.electronAPI.executeQuery('SELECT * FROM material', (error) => {
  //   if (error) {
  //     console.error('Error al ejecutar la consulta:', error);
  //   }
  // });
});
