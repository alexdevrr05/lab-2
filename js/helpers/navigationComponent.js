function addNavigationComponent () {
    const navigationComponent = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark justify-content-center">
        <div class="container-fluid">
          <a class="navbar-brand" href="index.html">Inicio</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav ms-auto">
              <a class="nav-link active" aria-current="page" href="material-view.html">Material</a><br><br>
              <a class="nav-link active" aria-current="page" href="reactivo.html">Reactivos</a>
              <a class="nav-link active" aria-current="page" href="practica.html">Prácticas</a>
            </div>
          </div>
        </div>
      </nav>
    `;

    const headerElement = document.getElementById('header');
    if (headerElement) {
      headerElement.innerHTML = navigationComponent;
    }
  }
  
  export { addNavigationComponent };
  