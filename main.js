// Función para solicitar un archivo HTML y colocar su contenido en un contenedor
function loadFragment(url, targetId) {
  // 1. Inicia la solicitud para obtener el archivo
  fetch(url)
    .then((response) => {
      // Si la solicitud no es exitosa (ej: 404 Not Found), lanza un error
      if (!response.ok) {
        throw new Error("Error al cargar el fragmento: " + response.statusText);
      } // Si es exitosa, convierte la respuesta en texto
      return response.text();
    })
    .then((html) => {
      // 2. Busca el contenedor en el HTML
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // 3. Inserta el texto (el contenido de bebidas.html) dentro del contenedor
        targetElement.innerHTML = html;

        // 🚨 CORRECCIÓN CLAVE: Ejecutamos el filtro aquí.
        // Esto asegura que si el usuario ya escribió algo en el input,
        // las bebidas recién cargadas sean filtradas inmediatamente.
        filtrarElementos();
      }
    }) // Muestra errores en la consola si algo falla
    .catch((error) => console.error("Fallo en la carga del fragmento:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname; // Verifica si la página es Mediodía O Noche

  if (path.includes("mediodia.html") || path.includes("noche.html")) {
    // Llama a la función de carga
    loadFragment(
      "/donatilio-menu/bebidas.html",
      "bebidas-genericas-placeholder"
    );
  }
});

function filtrarElementos() {
  const input = document.getElementById("inputBuscador"); // Añadimos .trim() para robustecer contra espacios
  const filtro = input.value.toLowerCase().trim(); // 1. Obtener todos los elementos buscables (platos y bebidas)

  const elementos = document.getElementsByClassName("elemento-buscable"); // 2. Recorrer cada elemento

  for (let i = 0; i < elementos.length; i++) {
    const elemento = elementos[i]; // Obtener el valor de 'data-nombre'

    let textoBusqueda =
      elemento.getAttribute("data-nombre") ||
      elemento.textContent ||
      elemento.innerText;
    textoBusqueda = textoBusqueda.toLowerCase(); // 3. Ocultar/Mostrar el plato/bebida

    if (textoBusqueda.includes(filtro)) {
      elemento.style.display = ""; // Mostrar
    } else {
      elemento.style.display = "none"; // Ocultar
    }
  } // --- LÓGICA DE OCULTAR SECCIONES VACÍAS --- // 4. Obtener todas las secciones de categoría

  const categorias = document.getElementsByClassName("categoria"); // 5. Recorrer cada sección

  for (let i = 0; i < categorias.length; i++) {
    const categoria = categorias[i]; // Buscar todos los ítems dentro de esta categoría específica

    const itemsEnCategoria = categoria.querySelectorAll(".item");

    let itemsVisibles = 0; // 6. Contar cuántos ítems están visibles

    for (let j = 0; j < itemsEnCategoria.length; j++) {
      // Un elemento está visible si su estilo display NO es 'none'
      if (itemsEnCategoria[j].style.display !== "none") {
        itemsVisibles++;
      }
    } // 7. Decidir si ocultar o mostrar la categoría completa // Ocultar solo si no hay ítems visibles Y hay un filtro activo

    if (itemsVisibles === 0 && filtro !== "") {
      categoria.style.display = "none";
    } else {
      // Mostrar si hay ítems visibles o si el filtro está vacío
      categoria.style.display = "";
    }
  }
}
