// Proceso del navegador para enviar informacion node <-> navegador


window.addEventListener('DOMContentLoaded', () => {
    window.electronAPI.onUpdateTheme((event, theme) => {
      const root = document.documentElement;
      console.log(theme);
      root.style.setProperty('--scheme', theme);
    });
  });

// window.electronAPI.onUpdateTheme((event, theme) => {
//     const root = document.documentElement;
//     root.style.setProperty('--scheme', theme);
// });
