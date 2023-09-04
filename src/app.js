//TODO: la carpeta public representa nuestro front-end

import express from "express";

//Modulos de rutas
import prodsRouter from "./routes/products.routes.js";
import carritoRouter from "./routes/carrito.routes.js";

//Modulos para el JSON directo
import { CarritoManager } from "./routes/main.js";
import { ProductManager } from "./routes/main.js";

//multer para subir imagenes
import multer from "multer";

//engine para crear plantillas en handlebars
import { engine } from "express-handlebars";

import { Server } from "socket.io";

//verificador de rutas del pc
import { __dirname } from "./path.js";
//con path concatenamos dos rutas independientemente de la direccion de las barras del directorio
import path from "path";

//Puerto del server
const PORT = 4000;

//iniciamos el server
const app = express();

//?CONFIGURACION DE MULTER PARA SUBIR IMAGENES
//Configuracion de multer
const storage = multer.diskStorage({
  /* definimos donde guardaremos la imagen */
  destination: (req, file, cb) => {
    cb(null, "src/public/img"); //null hace referencia a que no envia errores
  },
  filename: (req, file, cb) => {
    //le ponemos la fecha mas el nombre concatenado del archivo para hacerlos unicos
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

//?INICIAMOS SERVIDOR SOCKET IO
/* generamos el server ahora con socket io y no con express */
const serverExpress = app.listen(PORT, () => {
  console.log(`server on port ${PORT}`);
});

//?MIDDLEWARES DE EXPRESS
//Middlewares
app.use(express.json()); //para que podamos trabajar en json
app.use(express.urlencoded({ extended: true })); //para que podamos trabajar con querys largas
const upload = multer({ storage: storage }); //aplicamos la config multer
//?MIDLEWARES DE HANDLEBARS
app.engine("handlebars", engine()); //Defino que motor de plantillas voy a utilizar y su config
app.set("view engine", "handlebars"); //Setting de mi app de hbs
app.set("views", path.resolve(__dirname, "./views")); //Resolver rutas absolutas a traves de rutas relativas
app.use("/static", express.static(path.join(__dirname, "/public"))); //me evito el problema de la ruta en diferentes sist operativos u otros pc y sirve para ocupar la carpeta public para el handlebars

//?INICIAMOS SOCKET IO Y ESTABLECEMOS LA CONEXION CON EL FRONT

const io = new Server(serverExpress);

io.on("connection", (socket) => {
  console.log("servidor Socket.io conectado");
  /* socket.on("mensajeConexion", (user) => {
    if (user.rol === "admin") {
      socket.emit("credencialesConexion", "Usuario valido");
    } else {
      socket.emit("credencialesConexion", "Usuario no Valiso");
    }
  }); */

  socket.on("nuevoProducto", async (nuevoProd) => {
    const manager = new ProductManager();
    const añadirProducto = await manager.addProduct(nuevoProd);
    if (añadirProducto) {
      // Emitir un mensaje de éxito al cliente
      socket.emit("mensaje", "producto añadido correctamente");
      // Emitir la lista actualizada de productos al cliente
      const mostrar = await manager.getProducts();
      socket.emit("prods", mostrar);
    } else {
      // Emitir un mensaje de error al cliente
      socket.emit("mensaje", "producto ya agregado anteriormente");
    }
  });
});

//?RUTAS A LA API
app.use("/api/products", prodsRouter);
app.use("/api/carrito", carritoRouter);

//?APLICANDO MULTER
//aplicamos el middleware multer que se aplica a nivel de endpoint
app.post("/upload", upload.single("product"), (req, res) => {
  //metodo single especifica que subiremos una sola imagen llamada product
  console.log(req.file);
  console.log(req.body);
  res.status(200).send("imagen cargada");
});

//?APLICANDO EL HANDLEBARS
app.get("/static", (req, res) => {
  /* podemos inicializar variables y entregarselas a la plantilla que se renderice que en este caso es home */
  const user = {
    nombre: "maria",
    cargo: "tutor",
  };

  const cursos = [
    { numCurso: 123, dia: "S", horario: "Mañana" },
    { numCurso: 456, dia: "MyJ", horario: "Tarde" },
    { numCurso: 789, dia: "LyM", horario: "Noche" },
  ];
  /* body tomara la pantilla que se renderice aca en este caso home */
  res.render("realTimeProducts", {
    css: "style.css",
    title: "Chat",
    js: "realTimeProducts.js",
  });
});
