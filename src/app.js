import express from 'express';
import ProductManager from './ProductManager.js';

const app = express ();
const PORT= 8080;

const productManager =  new ProductManager ("./.products.json");




app.get('/products',  async (req, res)=>{
    const data=  await productManager.getProducts() 
    
    const limite = parseInt(req.query.limit);
  
    const products = limite ? data.slice(0,limite) : data
   
      res.json(products);
   
        

})




app.get('/productId/:productId',  async (req, res)=>{
    const productId = req.params.productId;
    const data = await productManager.getProducts();
   // const data = await productManager.getProductById(productId);
    const product = data.find((p)=>p.id==productId);

    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
       res.json(product);
    });


 app.listen(PORT, ()=>{
        console.log(`Servidor con express en el puerto ${PORT}`)

 });