import express from 'express';
import ProductManager from './ProductManager.js';
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";

const app = express ();
const PORT= 8080;

const productManager =  new ProductManager ("./.products.json");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", productsRouter);

app.use("/", cartsRouter);



 app.listen(PORT, ()=>{
        console.log(`Servidor con express en el puerto ${PORT}`)

 });