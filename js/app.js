// Interfaz de la tienda: pinta el catálogo, gestiona eventos y el carrito

const carrito = new Carrito(PRODUCTOS, window.localStorage);
const $ = selector => document.querySelector(selector);

const catalogo = $("#catalogo");
const buscador = $("#buscador");
const filtroCategoria = $("#filtro-categoria");
const orden = $("#orden");

// ---------- Catálogo ----------

function iniciarCategorias() {
  const categorias = [...new Set(PRODUCTOS.map(p => p.categoria))].sort();
  categorias.forEach(c => filtroCategoria.add(new Option(c, c)));
}

function productosFiltrados() {
  const texto = buscador.value.trim().toLowerCase();
  const categoria = filtroCategoria.value;
  const lista = PRODUCTOS.filter(p =>
    (categoria === "todas" || p.categoria === categoria) &&
    p.nombre.toLowerCase().includes(texto)
  );
  switch (orden.value) {
    case "precio-asc":  return lista.sort((a, b) => a.precio - b.precio);
    case "precio-desc": return lista.sort((a, b) => b.precio - a.precio);
    case "nombre":      return lista.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    default:            return lista;
  }
}

function pintarCatalogo() {
  const lista = productosFiltrados();
  $("#sin-resultados").hidden = lista.length > 0;
  catalogo.innerHTML = "";
  lista.forEach(p => {
    const agotado = p.stock === 0;
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML = `
      <div class="tarjeta-icono">${p.icono}</div>
      <span class="etiqueta">${p.categoria}</span>
      <h3>${p.nombre}</h3>
      <p class="precio">${formatoEuros(p.precio)}</p>
      <p class="stock ${agotado ? "agotado" : ""}">${agotado ? "Agotado" : `${p.stock} en stock`}</p>
      <button class="btn-principal" data-id="${p.id}" ${agotado ? "disabled" : ""}>
        ${agotado ? "Sin stock" : "Añadir al carrito"}
      </button>`;
    catalogo.appendChild(tarjeta);
  });
}

catalogo.addEventListener("click", e => {
  const boton = e.target.closest("button[data-id]");
  if (!boton) return;
  try {
    carrito.anadir(Number(boton.dataset.id));
    avisar("Producto añadido al carrito ✔");
    pintarCarrito();
  } catch (err) {
    avisar(err.message, true);
  }
});

[buscador, filtroCategoria, orden].forEach(el => el.addEventListener("input", pintarCatalogo));

// ---------- Carrito ----------

function pintarCarrito() {
  const items = carrito.items;
  const lista = $("#lista-carrito");
  lista.innerHTML = "";
  items.forEach(i => {
    const li = document.createElement("li");
    li.className = "linea";
    li.innerHTML = `
      <span class="linea-icono">${i.icono}</span>
      <div class="linea-info">
        <strong>${i.nombre}</strong>
        <small>${formatoEuros(i.precio)} / ud.</small>
      </div>
      <div class="cantidad">
        <button class="btn-icono" data-accion="menos" data-id="${i.id}" aria-label="Quitar uno">−</button>
        <span>${i.cantidad}</span>
        <button class="btn-icono" data-accion="mas" data-id="${i.id}" aria-label="Añadir uno">+</button>
      </div>
      <span class="linea-importe">${formatoEuros(i.importe)}</span>
      <button class="btn-icono" data-accion="quitar" data-id="${i.id}" aria-label="Eliminar">🗑</button>`;
    lista.appendChild(li);
  });

  const r = carrito.resumen;
  $("#subtotal").textContent = formatoEuros(r.subtotal);
  $("#iva").textContent = formatoEuros(r.iva);
  $("#envio").textContent = r.envio === 0 ? "Gratis" : formatoEuros(r.envio);
  $("#total").textContent = formatoEuros(r.total);
  $("#contador-carrito").textContent = carrito.numeroUnidades;
  $("#carrito-vacio").hidden = items.length > 0;
  $("#btn-pagar").disabled = items.length === 0;
}

$("#lista-carrito").addEventListener("click", e => {
  const boton = e.target.closest("button[data-accion]");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  const actual = carrito.lineas.get(id) || 0;
  try {
    if (boton.dataset.accion === "mas") carrito.cambiarCantidad(id, actual + 1);
    if (boton.dataset.accion === "menos") carrito.cambiarCantidad(id, actual - 1);
    if (boton.dataset.accion === "quitar") carrito.quitar(id);
  } catch (err) {
    avisar(err.message, true);
  }
  pintarCarrito();
});

function abrirCarrito(abrir) {
  $("#panel-carrito").classList.toggle("abierto", abrir);
  $("#panel-carrito").setAttribute("aria-hidden", String(!abrir));
  $("#fondo").hidden = !abrir;
}

$("#btn-carrito").addEventListener("click", () => abrirCarrito(true));
$("#cerrar-carrito").addEventListener("click", () => abrirCarrito(false));
$("#fondo").addEventListener("click", () => abrirCarrito(false));
$("#btn-vaciar").addEventListener("click", () => {
  carrito.vaciar();
  pintarCarrito();
});

// ---------- Pedido ----------

const dialogo = $("#dialogo-pedido");
const form = $("#form-pedido");

$("#btn-pagar").addEventListener("click", () => {
  form.reset();
  $("#errores").textContent = "";
  dialogo.showModal();
});
$("#cancelar-pedido").addEventListener("click", () => dialogo.close());

form.addEventListener("submit", e => {
  e.preventDefault();
  const mensajes = {
    nombre: "El nombre debe tener al menos 3 caracteres.",
    email: "Introduce un email válido.",
    telefono: "El teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9.",
    direccion: "Introduce una dirección.",
    cp: "El código postal debe tener 5 dígitos."
  };
  const errores = [...form.elements]
    .filter(el => el.name && !el.checkValidity())
    .map(el => mensajes[el.name]);

  if (errores.length > 0) {
    $("#errores").innerHTML = errores.join("<br>");
    return;
  }
  const total = formatoEuros(carrito.resumen.total);
  const nombre = form.elements.nombre.value.trim().split(" ")[0];
  dialogo.close();
  carrito.vaciar();
  pintarCarrito();
  abrirCarrito(false);
  avisar(`¡Gracias, ${nombre}! Pedido confirmado por ${total} 🎉`);
});

// ---------- Avisos ----------

let temporizador;
function avisar(texto, error = false) {
  const aviso = $("#aviso");
  aviso.textContent = texto;
  aviso.className = "aviso visible" + (error ? " error" : "");
  clearTimeout(temporizador);
  temporizador = setTimeout(() => (aviso.className = "aviso"), 2500);
}

iniciarCategorias();
pintarCatalogo();
pintarCarrito();
