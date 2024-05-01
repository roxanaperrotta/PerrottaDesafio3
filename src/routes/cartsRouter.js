import express from "express";
import CartManager from "../managers/CartManager.js";


const cartManager = new CartManager;

const router = express.Router();

router.get("/", (req, res)=>{

    res.json(cartManager.carts);
})


router.post("/cart", async (req, res)=>{
    try {
        const cart=req.body
        const newCart = await cartManager.addCart(cart)
        res.json(newCart);

    } catch (error) {
        console.error("error")

    }
 });

router.get("/cart/:cid", async (req, res)=>{
    try {
        const id = parseInt (req.params.cid);
        const cart = await cartManager.getCartById(id);
        res.json(cart);


    } catch (error) {
        res.status(500).json({error:error.message});
    }

    router.post("/cart/:cid/product/:pid", async(req, res)=>{
    try{
    const cartId=parseInt(req.params.cid);
    const productId=parseInt(req.params.pid);
    const cart = await cartManager.addProduct(cartId, productId);
    res.json(cart)
    }catch(error){
     return"error"
     };
    });

router.delete("/cart/:cid/product/:pid", async(req, res)=>{
    try {
        const cartId = parseInt(req.params.cid);
        const productId=parseInt(req.params.pid);
        const cart= await cartManager.deleteProduct(cartId, productId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({error:error.message})

    };
});

}
)

export default router 