// Función para solicitar un archivo HTML y colocar su contenido en un contenedor
function loadFragment(url, targetId) {
  // 1. Inicia la solicitud para obtener el archivo (url: '/donatilio-menu/bebidas.html')
  fetch(url)
    .then((response) => {
      // Si la solicitud no es exitosa (ej: 404 Not Found), lanza un error
      if (!response.ok) {
        throw new Error("Error al cargar el fragmento: " + response.statusText);
      }
      // Si es exitosa, convierte la respuesta en texto
      return response.text();
    })
    .then((html) => {
      // 2. Busca el contenedor en el HTML (targetId: 'bebidas-genericas-placeholder')
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // 3. Inserta el texto (el contenido de bebidas.html) dentro del contenedor
        targetElement.innerHTML = html;
      }
    })
    // Muestra errores en la consola si algo falla
    .catch((error) => console.error("Fallo en la carga del fragmento:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // Verifica si la página es Mediodía O Noche
  if (path.includes("mediodia.html") || path.includes("noche.html")) {
    // Llama a la función de carga con la RUTA ABSOLUTA para GitHub Pages
    loadFragment(
      "/donatilio-menu/bebidas.html",
      "bebidas-genericas-placeholder"
    );
  }
});
