fetch("/api/valoracion/top/5")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("carousel-inner");
    const carouselWrapper = document.getElementById("carouselExampleAutoplaying");
    const title = document.getElementById("valoraciones-title");

    if (!data || data.length === 0) {
      // No hay valoraciones: ocultar el carrusel y el título
      if (carouselWrapper) carouselWrapper.style.display = "none";
      if (title) title.style.display = "none";
      return;
    }

    data.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "carousel-item" + (index === 0 ? " active" : "");
      div.innerHTML = `
        <div>
          <h5 class="fw-bold">${item.nombre}</h5>
          <p class="text-warning" aria-label="${item.estrellas} estrellas">
            ${"<i class='bi bi-star-fill' aria-hidden='true'></i>".repeat(item.estrellas)}
            <span class="visually-hidden">${item.estrellas} estrellas</span>
          </p>
          <p class="fst-italic">${item.comentario}</p>
        </div>
      `;
      container.appendChild(div);
    });
  })
  .catch(err => console.error("Error cargando valoraciones:", err));
