const productos = [
  {
    id: 1,
    nombre: "correa de cuero 1/2",
    precio: 100,
    imagen:
      "https://calimodpruebaio.vtexassets.com/arquivos/ids/301978/4AAC0220008_1-correa-casual-para-caballeros-color-negrowisky.jpg?v=638821477679900000"
  },
  {
    id: 2,
    nombre: "hebilla importada liviana",
    precio: 100,
    imagen:
      "https://irumay.com/158-large_default/40mm-hebilla-pupo-giratorio-wf-450.jpg"
  },
  {
    id: 3,
    nombre: "correa de fibra",
    precio: 100,
    imagen:
      "https://res-console.cloudinary.com/diq8zz0yp/thumbnails/v1/image/upload/v1778034631/V2hhdHNBcHBfSW1hZ2VfMjAyNi0wNS0wNV9hdF8yMS4wMS4zOF90a2dwc2c=/template_primary/ZV9iYWNrZ3JvdW5kX3JlbW92YWwvYl9yZ2I6RkZGRkZGL2ZfcG5nLGVfaW1wcm92ZQ=="
  }
];

let carrito = [];

const listaProductos = document.getElementById("lista-productos");
const contador = document.getElementById("contador");
const itemsCarrito = document.getElementById("items-carrito");
const total = document.getElementById("total");

// MODAL
const modal = document.getElementById("modal");
const imgModal = document.getElementById("img-modal");
const cerrar = document.getElementById("cerrar");

// VARIABLES ZOOM
let escala = 1;
let posX = 0;
let posY = 0;
let isDragging = false;
let startX, startY;

// MOSTRAR PRODUCTOS
productos.forEach((prod) => {
  const div = document.createElement("div");
  div.classList.add("producto");

  const imagen = prod.imagen || "https://via.placeholder.com/200";

  div.innerHTML = `
    <img src="${imagen}" alt="${prod.nombre}">
    <h3>${prod.nombre}</h3>
    <p>$${prod.precio}</p>
    <button>Agregar</button>
  `;

  // CLICK IMAGEN → ABRIR MODAL
  const img = div.querySelector("img");
  img.addEventListener("click", () => abrirModal(imagen));

  // BOTÓN CARRITO
  const btn = div.querySelector("button");
  btn.addEventListener("click", () => agregarAlCarrito(prod.id));

  listaProductos.appendChild(div);
});

// ABRIR MODAL
function abrirModal(src) {
  modal.style.display = "block";
  imgModal.src = src;

  // reset
  escala = 1;
  posX = 0;
  posY = 0;
  actualizarTransform();
}

// ACTUALIZAR TRANSFORM
function actualizarTransform() {
  imgModal.style.transform = `translate(-50%, -50%) scale(${escala}) translate(${posX}px, ${posY}px)`;
}

// ZOOM CON SCROLL
imgModal.addEventListener("wheel", (e) => {
  e.preventDefault();
  escala += e.deltaY * -0.001;
  escala = Math.min(Math.max(1, escala), 4);
  actualizarTransform();
});

// ARRASTRAR IMAGEN
imgModal.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX - posX;
  startY = e.clientY - posY;
  imgModal.style.cursor = "grabbing";
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  posX = e.clientX - startX;
  posY = e.clientY - startY;
  actualizarTransform();
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  imgModal.style.cursor = "grab";
});

// CERRAR MODAL
cerrar.onclick = () => (modal.style.display = "none");

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// CARRITO
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  carrito.push(producto);
  actualizarCarrito();
}

function actualizarCarrito() {
  itemsCarrito.innerHTML = "";
  let suma = 0;

  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    itemsCarrito.appendChild(li);
    suma += item.precio;
  });

  contador.textContent = carrito.length;
  total.textContent = suma;
}

// WHATSAPP
function realizarPedido() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje = "*Nuevo Pedido*%0A%0A";

  carrito.forEach((item) => {
    mensaje += `• ${item.nombre} - $${item.precio}%0A`;
  });

  let totalPedido = carrito.reduce((sum, item) => sum + item.precio, 0);
  mensaje += `%0ATotal: $${totalPedido}`;

  let numero = "940225816";
  let url = `https://wa.me/${numero}?text=${mensaje}`;

  window.open(url, "_blank");

  carrito = [];
  actualizarCarrito();
}