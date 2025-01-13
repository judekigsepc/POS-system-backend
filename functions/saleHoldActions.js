const HeldSale = require("../models/heldSale.model")
const Joi = require('joi')
const { errorHandler, successMessageHandler } = require("../utils/util")
const { addToCart } = require("./cartActions")

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
            products: cart.cartProducts.map((product) => {
                if(product.type === 'product') {
                   return product.id
            }
        }),
            collections : cart.cartProducts.map((product) => {
                if(product.type === 'collection') {
                   return product.id
            }
        })
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
            addToCart(socket,cart,{prodId:product})
        })
        collections.forEach(collection => {
            addToCart(socket,cart,{prodId:collection})
        }) 
   
    }catch(err) {
        errorHandler(socket,err.message)
    }
}

module.exports = {
    holdSale,
    resumeHeldSale
}