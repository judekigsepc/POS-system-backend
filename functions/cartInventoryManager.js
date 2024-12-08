const Config = require("../models/config.model")
const Product = require("../models/product.model")
const { messageHandler, successMessageHandler, errorHandler } = require("../utils/util")


const clearCart = async (socket, cart) => {
      cart.cartProducts = []
      cart.cartGeneralDiscount = 0
      cart.cartTotal = 0

      socket.emit('cart-cleanup')
      successMessageHandler(socket,'cart cleared')
}

const inventoryUpdate = async (socket,savedTransaction) => {
    const {type,items} = savedTransaction
    try{
        if(type === 'purchase') {

            for(const item of items) {
               const productToUpdate = await Product.findById(item.itemId)
               stockHandler(socket,productToUpdate,item)
            }
            
            successMessageHandler(socket,'Inventory Updated successfully')
        }else if(type === 'refund') {
            
        }else {
            errorHandler(socket, 'FATAL: INVALID TRANSACTION TYPE DETECTED PLEASE CONTACT DEVELOPER')
        }

    }
    catch (err){
        errorHandler(socket, `Inventory Update Error: ${err} `)
    }

   
}

const stockHandler = async (socket, productToUpdate,item) => {
    try{
        if(!productToUpdate) {
           throw new Error('FATAL: INVALID PRODUCT DETECTED PLEASE CONTACT DEVELOPER')
        }
        const {name ,inStock, stockAlert, stockAlertLimit} = productToUpdate
        const config = await Config.find({})
        const {globalStockAlertLimit, globalStockAlert} = config[0]
        
        if(globalStockAlert) {
            if(stockAlert) {
                if(inStock < stockAlertLimit || inStock < globalStockAlertLimit){
                    messageHandler(socket, 'alert',`${name} is low in stock`)
                }
            }  
        } 
    
        const newStock = inStock - Number(item.itemQty)
        console.log(`${name} stock is ${newStock}`)

        if(newStock <= 0) {
            throw new Error(`${name} is OUT OF STOCK`)
        }else {
            const updatedProd = await Product.findByIdAndUpdate(item.itemId, {inStock: newStock}, {new: true})
        }
    }
    catch (err){
       return errorHandler(socket, `Stock handling Error: ${err}`)
    }
    

}

module.exports = {
    clearCart,
    inventoryUpdate
}