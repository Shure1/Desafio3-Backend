import { promises as fs } from "fs";

class ProductManager {
  constructor() {
    this.path = "./productos.json";
  }

  async addProduct(product) {
    const prodsJson = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const prodFilter = prodsJson.find((prod) => prod.code === product.code);

    if (prodFilter) {
      console.log("Producto ya encontrado");
      return;
    } else {
      const producto = new Product(product);
      prodsJson.push(producto);
      /* pasamos de objeto a texto plano (stringify) */
      await fs.writeFile(this.path, JSON.stringify(prodsJson));
      return prodsJson;
    }
  }

  async getProducts() {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    console.log(products);
    return products;
  }

  async getProductById(id) {
    const prodsJson = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const prod = prodsJson.find((prod) => prod.id === parseInt(id));

    if (prod) {
      console.log(prod);
      return [prod];
    } else {
      console.log("Producto no encontrado");
      return;
    }
  }

  async getProductByCode(code) {
    const prodsJson = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const prod = prodsJson.find((prod) => prod.code === parseInt(code));

    if (prod) {
      console.log(prod);
      return [prod];
    } else {
      console.log("Producto no encontrado");
      return;
    }
  }

  async uptadeProduct(id, actualizacion) {
    /* pasamos de texto plano a objeto (parse) */
    const prodsJson = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const productoIndice = prodsJson.findIndex(
      (producto) => producto.id === id
    );
    console.log(productoIndice);
    if (productoIndice !== -1) {
      /* si hay una propiedad distinta lo sobreescribe, sino lo deja tal como esta */
      prodsJson[productoIndice] = {
        ...prodsJson[productoIndice],
        ...actualizacion,
      };
      await fs.writeFile(this.path, JSON.stringify(prodsJson));
      return "producto actualizado";
    } else {
      console.log("producto no encontrado");
      return "producto no encontrado";
    }
  }

  /* Manera de actualizar mas de un campo a la vez (no se si esta bien o si se puede hacer de otra forma)
    uptadeProduct(id,actualizaciones){

        const producto = this.products.find(producto => producto.id === id)
        Object.assign(producto, actualizaciones);


    } */

  async deleteProduct(id) {
    let prodsJson = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const verificar = prodsJson.find((producto) => producto.id === id);

    /* si no encuentra el producto arrojara error, si lo encuentra filtramos el json para eliminarlo */
    !verificar ||
      (prodsJson = prodsJson.filter((productos) => productos.id !== id));
    await fs.writeFile(this.path, JSON.stringify(prodsJson));

    if (!verificar) {
      console.log("error de id");
    }
  }
}

class Product {
  constructor(title, description, price, code, stock, thumbnail) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.code = code;
    this.stock = stock;
    this.thumbnail = thumbnail;
    this.id = Product.incrementarId(); //Mi Id es el resultado de lo que devuelva este metodo
  }
  //Defino un metodo de CLASE
  static incrementarId() {
    //Si existe esta propiedad, la aumento en 1 o la creo
    if (this.idIncrement) {
      this.idIncrement++;
    } else {
      this.idIncrement = 1;
    }
    return this.idIncrement;
  }
}

class CarritoManager {
  constructor() {
    this.path = "./carrito.json";
    this.pathProducts = "./productos.json";
  }

  async AddCarrito(carritoNew) {
    const carritoJson = JSON.parse(await fs.readFile(this.path, "utf-8"));

    const carrito = new Carrito(carritoNew);
    const carritoFilter = carritoJson.find((carr) => carr.id === carrito.id);

    if (carritoFilter) {
      console.log("carrito ya ingresado");
    } else {
      carritoJson.push(carrito);

      /* pasamos de objeto a texto plano (stringify) */
      await fs.writeFile(this.path, JSON.stringify(carritoJson));
    }
  }

  async getCarrito(id) {
    const carritoJson = JSON.parse(await fs.readFile(this.path, "utf-8"));
    console.log(carritoJson);
    const carr = carritoJson.find((carr) => carr.id === id);
    console.log(carr);

    if (carr) {
      return carr;
    } else {
      return "Producto no encontrado";
    }
  }

  async addProduct(idProduct, idCarrito) {
    const carritoJson = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const posicionCarrito = carritoJson.findIndex(
      (carrito) => carrito.id === idCarrito
    );

    /* buscamos la posicion del carro si no esta creado */
    if (posicionCarrito !== -1) {
      const ProdJson = JSON.parse(
        await fs.readFile(this.pathProducts, "utf-8")
      );

      /* buscamos el id del producto en el inventario*/
      const prodFilter = ProdJson.find((prod) => prod.id === idProduct);
      /* buscamos el id del producto en el carrito */
      const carritoProd = carritoJson[posicionCarrito].products.findIndex(
        (producto) => producto.id === idProduct
      );

      /* si el producto existe en el inventario y en el carrito */
      if (prodFilter && carritoProd !== -1) {
        /* aumentamos la cantidad del producto ya existente */
        carritoJson[posicionCarrito].products[carritoProd].cantidad++;

        await fs.writeFile(this.path, JSON.stringify(carritoJson));
        return carritoJson[posicionCarrito];
      } else {
        /* si el carrito existe pero el producto no creamos un nuevo producto */
        const productoAdd = new ProdCarrito(prodFilter.id);

        carritoJson[posicionCarrito].products.push(productoAdd);
        await fs.writeFile(this.path, JSON.stringify(carritoJson));
        return carritoJson[posicionCarrito];
      }
    } else {
      return "carrito no encontrado";
    }
  }
}

class Carrito {
  constructor(Id, products) {
    this.id = Carrito.IncrementarID();
    this.products = [];
  }

  static IncrementarID() {
    if (this.idIncrement) {
      this.idIncrement++;
    } else {
      this.idIncrement = 1;
    }

    return this.idIncrement;
  }
}

class ProdCarrito {
  constructor(id) {
    this.id = id;
    this.cantidad = 1;
  }

  /* static incrementarCantidad() {
    if (this.incrementar) {
      this.incrementar++;
    } else {
      this.incrementar = 1;
    }
    return this.incrementar;
  } */
}

const producto1 = new Product("Arroz", "Rico", 300, "AA123LE", 20, []);
const producto2 = new Product("Lentejas", "Ricas", 300, "LL123LE", 20, []);
const producto3 = new Product("Garbanzos", "Rico", 300, "GG123LE", 20, []);
const carrito1 = new Carrito([producto1, producto2]);
const carrito2 = new Carrito([producto3, producto1]);

const productManager = new ProductManager();
const carritoManager = new CarritoManager();

const manageProducts = async () => {
  /* FUNCIONES DEL PRODUCTO */
  await productManager.addProduct(producto1);
  await productManager.addProduct(producto2);
  await productManager.addProduct(producto3);

  await productManager.getProducts();

  await productManager.uptadeProduct(1, { title: "pan" });
  await productManager.deleteProduct(1);
  await productManager.getProducts();
  /* FUNCIONES DEL CARRITO */

  await carritoManager.AddCarrito(carrito1);
  await carritoManager.AddCarrito(carrito2);
};

/* manageProducts(); */
console.log("hola");

export { ProductManager, CarritoManager };
