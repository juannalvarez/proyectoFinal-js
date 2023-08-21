
let productos = [];

fetch("./js/productos.json")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    cargarProductos(productos);
  });

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-secundario");
const contador = document.querySelector("#contador");

// Para almacenar los productos utilio esta variable
let productosEnCarrito =
  JSON.parse(localStorage.getItem("productos-en-carrito")) || [];


function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = productosElegidos
    .map(
      (producto) => `
        <div class="producto">
          <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}" />
          <div class="productos-detalles">
            <h3 class="producto-titulo">${producto.titulo}</h3>
            <p class="precio">${producto.precio}</p>
            <button class="producto-agregar" id="${producto.id}">Agregar</button>
          </div>
        </div>
      `
    )
    .join("");

  actualizarBotonesAgregar();
}

// Event listeners para los botones de categorías
botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    // Cambiar la clase "active" al botón de categoría seleccionado
    botonesCategorias.forEach((boton) =>
      boton.classList.toggle("active", boton === e.currentTarget)
    );

    // Filtrar los productos según la categoría que quieras
    const categoriaSeleccionada = e.currentTarget.id;
    const productosFiltrados =
      categoriaSeleccionada === "Todos"
        ? productos
        : productos.filter(
            (producto) => producto.categoria.id === categoriaSeleccionada
          );

    // Para ir cambiando los titulos principales
    tituloPrincipal.innerText =
      categoriaSeleccionada === "Todos"
        ? "Todos los productos"
        : e.currentTarget.innerText;

    cargarProductos(productosFiltrados);
  });
});

// Función para actualizar los botones "Agregar" 
function actualizarBotonesAgregar() {
  document
    .querySelectorAll(".producto-agregar")
    .forEach((boton) => boton.addEventListener("click", agregarAlCarrito));
}

// Para que el usuario sepa que se agregó un producto
function agregarAlCarrito(e) {
  Toastify({
    text: "Producto agregado",
    duration: 1000,
    close: true,
    gravity: "top",
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
    onClick: function () {}, 
  }).showToast();
  const idBoton = e.currentTarget.id;
  const productoAgregado = productos.find(
    (producto) => producto.id === idBoton
  );
    // Para agregar varios vinos de un mismo producto
  if (productosEnCarrito.some((producto) => producto.id === idBoton)) {
    productosEnCarrito.forEach((producto) => {
      if (producto.id === idBoton) producto.cantidad++;
    });
  } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }

  // Activo la funcion para actualziar el contador 
  actualizarcontador();

  // Guardar los productos en el carrito
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
}

// Actualizar contador de productos
function actualizarcontador() {
  const nuevoContador = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  contador.innerText = nuevoContador;
}