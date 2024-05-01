import express from 'express';
import ProductManager from './managers/ProductManager.js';
import productsRouter from "./routes/productsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import CartManager from './managers/CartManager.js';
import handlebars from 'express-handlebars';
import {Server} from "socket.io";
import {fileURLToPath} from "url";
import {dirname} from "path";
import path from "path";
import cors from "cors";


const app = express ();
const PORT= 8080;

const productManager =  new ProductManager ("./.products.json");
const cartManager = new CartManager ("./carts.json");

const __fileName =  fileURLToPath (import.meta.url);
const __dirnombre = dirname(__fileName);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join (__dirnombre, '/public')));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


//Configuración para handlebars

app.engine("handlebars", handlebars.engine());
app.set("views", __dirnombre + '/views');
app.set ("view engine", "handlebars")


app.use ('/', viewsRouter);
app.use ('/realtimeproducts', viewsRouter)


const httpServer = app.listen(PORT, () =>  console.log (`Server running on PORT ${PORT}`));

//Conexión con socket.io

const socketServer = new Server (httpServer)


socketServer.on("connection" , (socket) =>{
    console.log ("Nueva conexión");
    socket.on("mensaje", data =>{
      console.log("mensaje", data)});


    try {
        const products = productManager.getProducts();
        socketServer.emit("products", products);

    } catch (error) {
        socketServer.emit('response', { status: 'error', message: error.message });
    }
   

     socket.on("new-Product",   (newProduct) => {
        
        try {

           // Validate price
if (typeof newProduct.price !== 'number') {
    console.error('Price must be a number');
    // Handle the error accordingly
}

// Validate stock
if (typeof newProduct.stock !== 'number') {
    console.error('Stock must be a number');
    // Handle the error accordingly
}
                
            
            const productoNuevo = {
                  
                    title: newProduct.title,
                    description: newProduct.description,
                    code: newProduct.code,
                    price: newProduct.price,
                    stock: newProduct.stock,
                    thumbnail: newProduct.thumbnail,
    
            }
            

            const pushProduct =   productManager.addProduct(productoNuevo);
            const listaActualizada =   productManager.getProducts();
            socketServer.emit("products", listaActualizada);
            socketServer.emit("response", { status: 'success' , message: pushProduct});

        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })
  


    socket.on("delete-product", (id) => {
        try {
            const pid = parseInt(id)
            const deleteProduct =  productManager.deleteProduct(pid)
            const listaActualizada =  productManager.getProducts()
            socketServer.emit("products", listaActualizada)
            socketServer.emit('response', { status: 'success' , message: "producto eliminado correctamente"});
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    } )

})

