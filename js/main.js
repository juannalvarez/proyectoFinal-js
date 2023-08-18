
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

// Función para cargar los productos en el contenedor de productos
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

    // Para ir cambiando los titulos
    tituloPrincipal.innerText =
      categoriaSeleccionada === "Todos"
        ? "Todos los productos"
        : e.currentTarget.innerText;

    // Cargar los productos filtrados en el contenedor de productos
    cargarProductos(productosFiltrados);
  });
});

// Función para actualizar los botones "Agregar" 
function actualizarBotonesAgregar() {
  document
    .querySelectorAll(".producto-agregar")
    .forEach((boton) => boton.addEventListener("click", agregarAlCarrito));
}

// Función para agregar un producto al carrito
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

  if (productosEnCarrito.some((producto) => producto.id === idBoton)) {
    // Si el producto ya está en el carrito, aumentar la cantidad
    productosEnCarrito.forEach((producto) => {
      if (producto.id === idBoton) producto.cantidad++;
    });
  } else {
    // Si es un producto nuevo en el carrito, agregarlo con cantidad 1
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }

  // Actualizar el número de productos
  actualizarcontador();

  // Guardar los productos en el carrito
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
}

// Para actualizar numero de productos
function actualizarcontador() {
  const nuevoContador = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  contador.innerText = nuevoContador;
}