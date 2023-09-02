const socket = io();
const form = document.getElementById("idForm");
const botonProds = document.getElementById("botonProductos");
const container = document.querySelector(".container-products");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const datForm = new FormData(e.target); //Me genera un objeto iterador
  const prod = Object.fromEntries(datForm); //De un objeto iterable genero un objeto simple
  socket.emit("nuevoProducto", prod);
  socket.on("mensaje", (info) => {
    if (info === "producto añadido correctamente") {
      socket.on("prods", (mostrar) => {
        mostrar.forEach((producto) => {
          if (Array.isArray(mostrar)) {
            const productoDiv = document.createElement("div");
            productoDiv.classList.add("producto");

            productoDiv.innerHTML = `
              <h2>${producto.title}</h2>
              <p>${producto.description}</p>
              <p>Precio: $${producto.price}</p>
              <p>Código: ${producto.code}</p>
              <p>Stock: ${producto.stock}</p>
            `;

            // Agrego el productoDiv al div "container-products"
            container.appendChild(productoDiv);
          }
        });
      });
    } else {
      console.log("producto ya añadido previamente");
    }
  });
  e.target.reset();
});

botonProds.addEventListener("click", () => {
  console.log("Hola");
});
