import { Router } from "express";
import { CarritoManager } from "./main.js";

const carritoRouter = Router();
const CarritoManagerServer = new CarritoManager();

carritoRouter.post("/", async (req, res) => {
  const add = await CarritoManagerServer.AddCarrito(req.body);
  add && res.status(200).send("producto creado");
});

carritoRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const carrito = await CarritoManagerServer.getCarrito(parseInt(id));
  console.log(carrito);
  carrito
    ? res.status(200).send(carrito)
    : res.status(404).send("producto no encontrado");
});

carritoRouter.post("/:idc/producto/:idp", async (req, res) => {
  const { idc, idp } = req.params;

  const prodAdd = await CarritoManagerServer.addProduct(
    parseInt(idp),
    parseInt(idc)
  );
  console.log(prodAdd);

  try {
    prodAdd
      ? res.status(200).send(prodAdd)
      : res.status(404).send("error en ingresar el producto");
  } catch (error) {
    console.log("no se pudo ingresar el producto: ", error);
  }
});
export default carritoRouter;
