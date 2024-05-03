import fs from "fs"

class ProductManager{
    constructor (){
        this.filePath = ".products.json"
        this.products = []

    }


    addProduct (product){
    
        const {title, description, code, price, thumbnail="imagen no disponible",  stock=10} = product
    
        const newProduct={
            id: this.products.length + 1,
            title:title,
            description:description,
            code:code,
            price:price, 
            stock:stock,
            thumbnail:thumbnail
        };
        
    // Validación de inputs

        if (typeof title !== 'string' || title.trim() === '') {
            return '!!Atención: Título inválido o faltante';
        }
        if (typeof description !== 'string') {
            return '!!Atención: Descripción inválida';
        }
        if (typeof price !== 'number' || price < 0) {
            return '!!Atención: Precio inválido';
        }
        if (typeof code !== 'string' || code.trim() === '') {
            return '!!Atención: Código inválido o faltante';
        }
        if (typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
            return '!!Atención: Stock inválido';
        }

 //Revisar que no se dupliquen códigos

        const existingProduct=this.products.find(product=>product.code === code);

        if (existingProduct){
            return `!!Atención: Producto no agregado. El producto con código ${code} ya existe.`
        }

//Agregar al array  
      
        this.products.push(newProduct)   
        fs.writeFileSync(this.filePath, JSON.stringify (this.products, null, 2))
        return `Producto con código ${code} agregado`
    

    }

//Obtener productos

  
getProducts() { 
            if (this.filePath){
             let fileContent =  fs.readFileSync (this.filePath, 'utf8')
            // console.log(fileContent)
             const productsFromFile = JSON.parse(fileContent)
             console.log(productsFromFile)
             return productsFromFile
             }
         }
//Obtener producto por id

    getProductById(id){

        if (fs.existsSync(this.filePath)){
            let fileContent =  fs.readFileSync (this.filePath, 'utf8');
             //console.log(fileContent)
            const productsById = JSON.parse(fileContent);
            const productoId= productsById.find(product=>product.id===id);
            return productoId;
        }
}

   updateProduct (id, updatedFields){

        let foundProduct = this.products.find(product=>product.id===id)

        if (foundProduct){
            let selectedProduct = foundProduct;
            Object.assign(selectedProduct, updatedFields);
            const updatedProductString = JSON.stringify(this.products, null, 2)
            fs.writeFileSync(this.filePath, updatedProductString);
            console.log(foundProduct)
            return `El producto con ID ${id} fue modificado exitosamente. `
        }

      
        return "Producto con es ID no encontrado"
       
    }

    deleteProduct (id){

        let foundProduct = this.products.find(product=>product.id===id)

        if (foundProduct){

            let index = this.products.findIndex(product => product.id === id);
            if (index !== -1) {
                this.products.splice(index, 1);
            }

            try {
                const fileContent = fs.readFileSync(this.filePath, 'utf8')
                const data = JSON.parse(fileContent)
                const updatedData = data.filter(product=>product.id!== id);
                fs.writeFileSync(this.filePath, JSON.stringify(updatedData, null, 2));
                console.log (this.products);
                return `El producto con ID ${id} fue eliminado exitosamente`

            } catch (error) {
                return `Error eliminando el producto. Error ${error}`
            }
        }
        else{
            return `Producto con ID ${id} no encontrado`
        }
    }



}


const productManager = new ProductManager()

export default ProductManager;

//prueba
/*
console.log(productManager.addProduct('sandía', 'fruta', 1500, 'f1111'));
console.log(productManager.addProduct('milanesa', 'carne', 1500, 'c1112'));
console.log(productManager.addProduct('jamón crudo', 'fiambre', 1800, 'fi1113'));

console.log(productManager.addProduct('melón', 'fruta', 700, 'c1112'));
console.log(productManager.addProduct('lechuga'));
console.log(productManager.addProduct('lechuga', 'verdura', 900));

console.log(productManager.addProduct('lechuga', 'verdura', 900, 'v1234'));

console.log(productManager.addProduct('remolacha', 'verdura', 3000, 'v6789'))

console.log('---------------------')

console.log(productManager.getProducts())
console.log(productManager.getProductById(4))

console.log(productManager.updateProduct(5, {description:'vegetal'}))
console.log(productManager.updateProduct(3, {stock:5}))
console.log(productManager.deleteProduct(4))
console.log(productManager.deleteProduct(6))
    */
