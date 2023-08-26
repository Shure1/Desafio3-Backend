alert("hola");
/* podemos usar socket io ya que en el main.handlebars lo llamamos antes de importar este script */
const socket = io();
//envio al backend info
socket.emit("mensajeConexion", { user: "francisco", rol: "admin" });

//recibo del backend info
socket.on("credencialesConexion", (info) => {
  console.log(info);
});
