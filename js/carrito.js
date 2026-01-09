let carrito = {};

function agregarAlCarrito(nombre, precio) {
  if (carrito[nombre]) {
    carrito[nombre].cantidad++;
  } else {
    carrito[nombre] = { precio: precio, cantidad: 1 };
  }
  actualizarInterfaz();
}

function restarDelCarrito(nombre) {
  if (carrito[nombre]) {
    carrito[nombre].cantidad--;
    if (carrito[nombre].cantidad <= 0) {
      delete carrito[nombre];
    }
  }
  actualizarInterfaz();
}

function actualizarInterfaz() {
  let total = 0;
  let cantidadTotal = 0;
  const contenedores = document.querySelectorAll(".controles-cantidad");

  contenedores.forEach((div) => {
    const nombre = div.getAttribute("data-id");
    const precio = div.getAttribute("data-precio");
    const item = carrito[nombre];

    if (item && item.cantidad > 0) {
      div.innerHTML = `
        <div class="selector-celeste">
            <button onclick="restarDelCarrito('${nombre}')">−</button>
            <span class="cantidad-txt">${item.cantidad}</span>
            <button onclick="agregarAlCarrito('${nombre}', ${precio})">+</button>
        </div>`;
    } else {
      div.innerHTML = `<button class="btn-agregar" onclick="agregarAlCarrito('${nombre}', ${precio})">+</button>`;
    }
  });

  for (let p in carrito) {
    total += carrito[p].precio * carrito[p].cantidad;
    cantidadTotal += carrito[p].cantidad;
  }

  const barra = document.getElementById("barra-carrito");
  if (barra) {
    barra.style.display = cantidadTotal > 0 ? "flex" : "none";
    document.getElementById("cant-items").innerText =
      cantidadTotal + (cantidadTotal > 1 ? " productos" : " producto");
    document.getElementById("total-carrito").innerText = "$" + total;
  }
}

// --- FUNCIONES DEL MODAL ---

function enviarPedido() {
  if (Object.keys(carrito).length === 0) return;
  // Abrimos el modal con flex para que se centre correctamente
  document.getElementById("modal-datos").style.display = "flex";
}

function cerrarModal() {
  const modal = document.getElementById("modal-datos");
  if (modal) {
    modal.style.display = "none";
  }
}

// --- PROCESAR ENVÍO FINAL (ACTUALIZADO CON NUEVOS CAMPOS) ---

function procesarEnvioFinal() {
  // Capturamos todos los campos del modal
  const nombre = document.getElementById("cliente-nombre").value.trim();
  const direccion = document.getElementById("cliente-direccion").value.trim();
  const aclaraciones = document
    .getElementById("cliente-aclaraciones")
    .value.trim();
  const entrecalles = document
    .getElementById("cliente-entrecalles")
    .value.trim();

  // Validación de campos obligatorios
  if (!nombre || !direccion) {
    alert("Por favor, completa los campos obligatorios (*)");
    return;
  }

  // Construcción del mensaje con mejor formato
  let mensaje = `*🍕 NUEVO PEDIDO - DONATILIO* 🍕\n`;
  mensaje += `*━━━━━━━━━━━━━━━━━━━━*\n`;
  mensaje += `👤 *Cliente:* ${nombre}\n`;
  mensaje += `📍 *Dirección:* ${direccion}\n`;

  // Agregamos opcionales solo si tienen contenido
  if (aclaraciones) mensaje += `🏢 *Aclaraciones:* ${aclaraciones}\n`;
  if (entrecalles) mensaje += `🛣️ *Entrecalles:* ${entrecalles}\n`;

  mensaje += `*━━━━━━━━━━━━━━━━━━━━*\n\n`;

  for (let p in carrito) {
    mensaje += `✅ ${p} (x${carrito[p].cantidad}) - $${
      carrito[p].precio * carrito[p].cantidad
    }\n`;
  }

  const totalTexto = document.getElementById("total-carrito").innerText;
  mensaje += `\n*━━━━━━━━━━━━━━━━━━━━*`;
  mensaje += `\n💰 *TOTAL A COBRAR: ${totalTexto}*`;
  mensaje += `\n*━━━━━━━━━━━━━━━━━━━━*`;
  mensaje += `\n\n¿Me confirmarían el pedido?`;

  // Número sin el "+" para máxima compatibilidad con wa.me
  const numeroTelefono = "5493812236303";

  const url = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(
    mensaje
  )}`;

  window.open(url, "_blank");
  cerrarModal();
}
function verificarHorario() {
  const ahora = new Date();
  const dia = ahora.getDay(); // 0:Dom, 1:Lun, 2:Mar, 3:Mié, 4:Jue, 5:Vie, 6:Sáb
  const hora = ahora.getHours();
  const minutos = ahora.getMinutes();
  const tiempoActual = hora * 60 + minutos;

  let estaAbierto = false;
  let mensajeAviso = "";

  // --- CONFIGURACIÓN DE HORARIOS ---
  const aperturaM = 7 * 60; // 07:00
  const cierreM = 15 * 60; // 15:00
  const aperturaN = 18 * 60; // 18:00
  const cierreN_Normal = 24 * 60; // 00:00 (Lun a Jue)
  const cierreN_Extendido = 25 * 60; // 01:00 (Vie y Sáb)

  // --- LÓGICA DE APERTURA ---

  // 1. CASO ESPECIAL: Madrugada (00:00 a 01:00)
  // Si es Domingo antes de la 1am, revisamos si el Sábado cerraba tarde.
  // Si es Sábado antes de la 1am, revisamos si el Viernes cerraba tarde.
  if (tiempoActual < 1 * 60) {
    if (dia === 0 || dia === 6) {
      estaAbierto = true;
    }
  }

  // 2. HORARIO NORMAL DEL DÍA (Excepto Domingo que está cerrado todo el día)
  else if (dia !== 0) {
    // Turno Mañana (Igual para todos)
    if (tiempoActual >= aperturaM && tiempoActual < cierreM) {
      estaAbierto = true;
    }
    // Turno Noche
    else if (tiempoActual >= aperturaN) {
      // Si es Viernes (5) o Sábado (6), cierra a la 1:00 AM (25*60)
      if (dia === 5 || dia === 6) {
        if (tiempoActual < cierreN_Extendido) estaAbierto = true;
      }
      // Si es otro día, cierra a las 00:00 (24*60)
      else {
        if (tiempoActual < cierreN_Normal) estaAbierto = true;
      }
    }
  }

  // --- DEFINIR MENSAJES DE AVISO SI ESTÁ CERRADO ---
  if (!estaAbierto) {
    if (dia === 0) {
      mensajeAviso = "Domingos cerrado";
    } else if (tiempoActual < aperturaM) {
      mensajeAviso = "Abrimos a las 07:00 hs";
    } else if (tiempoActual >= cierreM && tiempoActual < aperturaN) {
      mensajeAviso = "Abrimos a las 18:00 hs";
    } else {
      mensajeAviso = "Abrimos mañana a las 07:00 hs";
    }
  }

  // --- ACTUALIZAR INTERFAZ ---
  const btnEnviar = document.querySelector(".btn-finalizar");
  const textoEstado = document.getElementById("estado-horario");

  if (estaAbierto) {
    if (btnEnviar) {
      btnEnviar.disabled = false;
      btnEnviar.style.backgroundColor = "#25d366";
      btnEnviar.innerText = "ENVIAR PEDIDO";
      btnEnviar.style.opacity = "1";
    }
    if (textoEstado) {
      textoEstado.innerText = "¡Estamos abiertos!";
      textoEstado.style.color = "#25d366";
    }
  } else {
    if (btnEnviar) {
      btnEnviar.disabled = true;
      btnEnviar.style.backgroundColor = "#555";
      btnEnviar.innerText = "CERRADO";
      btnEnviar.style.opacity = "0.6";
    }
    if (textoEstado) {
      textoEstado.innerText = mensajeAviso;
      textoEstado.style.color = "#ff4444";
    }
  }
}
// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", verificarHorario);
