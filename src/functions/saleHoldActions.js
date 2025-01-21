const HeldSale = require("../models/heldSale.model")
const Joi = require('joi')
const { errorHandler, successMessageHandler } = require("../utils/util")
const { addToCart } = require("./cartActions")
const Product = require("../models/product.model")

const heldSaleschema = Joi.object({
      identifier : Joi.string().required(),
      executor: Joi.string().required(),
      reason: Joi.string(),
      products: Joi.array().required(),
      collections:Joi.array().required()
})

const holdSale = async (socket,cart,data) => {
    try {

        if(cart.cartProducts.length < 1 ) {
            console.log(cart.cartProducts)
            return errorHandler(socket,'SALE HOLD ERROR: Cart is empty')
        }

        const {identifier,executor,reason} = data
    
        const saleToHold = {
            identifier,
            executor,
            reason,
            products: await handleUnStock(cart.cartProducts,'products'),
            collections : await handleUnStock(cart.cartProducts,'products')
        }
    
        
       const {error} = heldSaleschema.validate(saleToHold)
       
       if(error) {
        return errorHandler(socket,error.details[0].message)
       }
     
       await HeldSale.create(saleToHold)

       successMessageHandler(socket,`Sale ${identifier} held successfuly`)
       socket.emit('cart-cleanup')

    }catch(err) {
       return errorHandler(socket,err)
    }
}

const resumeHeldSale = async (socket,cart,saleId) => {
    try {
  
        const requestedHeldSale = await HeldSale.findById(saleId)
        const {collections, products} = requestedHeldSale
    
        products.forEach((product) => {
            addToCart(socket,cart,{prodId:product, qty:9})
        })
        collections.forEach(collection => {
            addToCart(socket,cart,{prodId:collection, qty:9})
        }) 
   
    }catch(err) {
        errorHandler(socket,err.message)
    }
}

module.exports = {
    holdSale,
    resumeHeldSale
}


const handleUnStock = async (products,type) => {
    try {
        if (type === 'products') {
            let productPromises = []
            let productObjects = []
       
            for (let i = 0; i < products.length; i++) {
                if(products[i].type === 'product') {
                    productObjects.push( {prodId: products[i].id , qty: products[i].qty} )
       
                    const promise = Product.findByIdAndUpdate(products[i].id,
                        {$inc: {inStock: -products[i].qty }},
                        {new:true})
            
                    productPromises.push(promise)
                }
            }
            await Promise.all(productPromises)
            return productObjects

        }else if(type === 'collections') {
            
           
        }else {
            throw new Error('FATAL:- SALE HOLD FAILED - INVALID SALE ITEM TYPE')
        }
 
    }catch(err) {
         console.log(err.message)
    }
    
}