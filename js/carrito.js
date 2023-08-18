// Selección de elementos del DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const contenedorTotal = document.querySelector("#total");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const botonComprar = document.querySelector(".carrito-acciones-comprar");
// Variable para almacenar los productos en el carrito
let productosEnCarrito =
  JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

// Funcion para cargar los productos
function cargarProductosCarrito() {
  const carritoVacio = productosEnCarrito.length === 0;
  contenedorCarritoVacio.classList.toggle("disabled", !carritoVacio);
  contenedorCarritoProductos.classList.toggle("disabled", carritoVacio);
  contenedorCarritoAcciones.classList.toggle("disabled", carritoVacio);
  contenedorCarritoComprado.classList.toggle("disabled", true);

  if (!carritoVacio) {
    // Para ver que contiene el carrito
    contenedorCarritoProductos.innerHTML = "";
    productosEnCarrito.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
        <img class="carrito-producto-imagen" src="../${producto.imagen}" alt="${producto.titulo
        }"/>
        <div class="carrito-producto-titulo">
          <small>Titulo</small>
          <p>${producto.titulo}</p>
        </div>
        <div class="carrito-producto-cantidad">
          <small>Cantidad</small>
          <p>${producto.cantidad}</p>
        </div>
        <div class="carrito-producto-precio">
          <small>Precio</small>
          <p>${producto.precio}</p>
        </div>
        <div class="carrito-producto subtotal">
          <small>Subtotal</small>
          <p>${producto.precio * producto.cantidad}</p>
        </div>
        <button class="carrito-producto-eliminar" data-id="${producto.id}">
          <i class="bi bi-trash3"></i>
        </button>
      `;
      contenedorCarritoProductos.append(div);
    });

    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach((boton) => {
      boton.addEventListener("click", eliminarDelCarrito);
    });
  }
  // Sumatoria total de todos los productos
  actualizarTotal();
}
// Función para eliminar un producto del carrito
function eliminarDelCarrito(e) {
  Toastify({
    text: "Producto eliminado!",
    duration: 2000,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#3e0723",
      borderRadius: "1.5rem",
    },
    offset: {
      x: "1.5rem",
      y: "1.5rem",
    },
    onClick: function () { },
  }).showToast();

  const idProducto = e.currentTarget.dataset.id;
  productosEnCarrito = productosEnCarrito.filter(
    (producto) => producto.id !== idProducto
  );

  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );

  cargarProductosCarrito();
}

function vaciarCarrito() {
  Swal.fire({
    title: "Estas seguro de querer borrar los productos?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3e0723",
    cancelButtonColor: "#3e0723",
    confirmButtonText: "Si",
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      productosEnCarrito = [];
      localStorage.removeItem("productos-en-carrito");
      cargarProductosCarrito();
      Swal.fire("Tus productos fueron borrados!", "Seguí mirando nuestro catálogo", "success");
    }
  });
}
// Se actualiza el carrito 
function actualizarTotal() {
  const totalCalculado = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  contenedorTotal.innerText = `$${totalCalculado}`;
}

// Event listeners para los botones de "Vaciar carrito" y "Comprar"
botonVaciar.addEventListener("click", vaciarCarrito);
botonComprar.addEventListener("click", comprarCarrito);
cargarProductosCarrito();

// Finalizar la compra
function comprarCarrito() {
  Swal.fire({
    title: "Esperemos que lo disfrute! Vuelva pronto",
  });
  productosEnCarrito = [];
  localStorage.removeItem("productos-en-carrito");
  cargarProductosCarrito();
  contenedorCarritoVacio.classList.add("disabled");
  contenedorCarritoProductos.classList.add("disabled");
  contenedorCarritoAcciones.classList.add("disabled");
  contenedorCarritoComprado.classList.remove("disabled");
}
