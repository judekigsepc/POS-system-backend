const Config = require("../models/config.model")
const Product = require("../models/product.model")
const { messageHandler, successMessageHandler} = require("../utils/util")

//Function that clears up cart
const clearCart = async (socket, cart, payDetails) => {
      payDetails.expenditure = 0
      payDetails.payed = 0
      payDetails.change = 0

      cart.cartProducts = []
      cart.cartGeneralDiscount = 0
      cart.cartTotal = 0

      socket.emit('cart-cleanup')
      socket.emit('pay_cleanup', payDetails)
      
      successMessageHandler(socket,'cart cleared')
}


//Function that handles update of the inventory and stock managent incl. low stock alerts
const inventoryUpdate = async (socket,savedTransaction) => {
    const {type,items} = savedTransaction
    try{
        //Loop through item list
            for(const item of items) {
               const productToUpdate = await Product.findById(item.itemId)
             //Passed to the stock handler function
               stockHandler(socket,productToUpdate,item)
            }
            
            successMessageHandler(socket,'Inventory Updated successfully')
    }
    catch (err){
        throw new Error (`Inventory Update Error: ${err} `)
    }

   
}

//Manages stock - stock alerts and the actual inventory update
const stockHandler = async (socket, productToUpdate,item) => {
    try{
        if(!productToUpdate) {
           throw new Error('FATAL: INVALID PRODUCT DETECTED PLEASE CONTACT DEVELOPER')
        }
        const {name ,inStock, stockAlert, stockAlertLimit,units} = productToUpdate
        const config = await Config.find({})
        const {globalStockAlertLimit, globalStockAlert} = config[0]

      
        if(inStock <= 0) {
            throw new Error(`${name} is OUT OF STOCK`)
        }else {
            const newStock = inStock - Number(item.itemQty)
            await Product.findByIdAndUpdate(item.itemId, {inStock: newStock}, {new: true})

            if(globalStockAlert) {
                if(stockAlert) {
                    if(newStock < stockAlertLimit || inStock < globalStockAlertLimit){
                        messageHandler(socket, 'alert', `${name} is low in stock with ${newStock} ${units}s left`)
                    }
                }  
            } 
        
        }
    }
    catch (err){
       throw new Error(`Stock handling Error: ${err}`)
    }
    

}

module.exports = {
    clearCart,
    inventoryUpdate
}