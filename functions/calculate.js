const Product = require('../models/product.model')
const Transaction = require('../models/transaction.model')

const {errorHandler, successMessageHandler} = require('../utils/util')
const {paymentFunc, confirmPaymentFunc} = require('./payments')
const {printInvoice, emailInvoice} = require('./invoiceActions')
const { validateIfNumber, validateIfString, validateMultipleNumbers } = require('../utils/validationUtils')
const { clearCart } = require('./cartInventoryManager')

//Calculates the totals provided with the cart array
const totalCalculator = (product) => {
      let total = 0
      product.forEach((product) => {
          total += product.subTotal
      })
      return total
}

//Function to add to cart
const addFunc = async (socket,cart,data) => {
      if (!socket && !data && !cart) {
            return console.error(socket, 'Internal server error');     
      }
      if(!data.prodId) {
            return errorHandler(socket,'No product id')
         }
         if (!data.qty) {
               data.qty = 1
         }
      
         //Check if product exists in database
         const wantedProduct = await Product.findById(data.prodId)
         if(!wantedProduct) {
              errorHandler(socket, 'Product Not found in database')
         }

         const {name, price,taxes,discount,discountType,units,sku,_id,inStock} = wantedProduct

         if(inStock <= 0) {
            return errorHandler(socket, `${name} is OUT OF STOCK - If you think this is wrong please contact system admin`)
         }
         let goneDiscount
         if(discountType === 'percent') {
            goneDiscount = discount /100 * price
         }else if(discountType === 'flat') {
            goneDiscount = discount
         }else {
            return errorHandler(socket,'I donno what type of fucked scenario would cause this kind of error')
         }
         
         const productSubTotal = ((Number(data.qty) * Number(price)) + taxes) - goneDiscount
         const product = {
               id:_id,
               name: name,
               price:price,
               subTotal:productSubTotal,
               sku: sku,
               tax:taxes,
               discount:discount,
               discountType:discountType,
               qty: data.qty,
               units:units,
         }

        
         const existingProductIndex = cart.cartProducts.findIndex(prod => prod.name === product.name);

          if (existingProductIndex !== -1) {
               const data = { prodIndex: existingProductIndex, qty: cart.cartProducts[existingProductIndex].qty + 1 };
               return updatorFunc(socket, cart, data);
            }
            
         cart.cartProducts.push(product)
         cart.cartTotal = totalCalculator(cart.cartProducts)
         
         const {cartTotal} = cart
         socket.emit('result',{product, cartTotal})
         successMessageHandler(socket, `${product.name} Added to cart`)
}

const updatorFunc = (socket,cart,data) => {
      try{
            let {prodIndex, qty} = data 

            //Check for presence and validity of the data types
            try{
                  validateMultipleNumbers([prodIndex, qty], 'Product index or quamtity may not be present or is Invalid(Should be string)')
            }
            catch(err) {
                 return errorHandler(socket, `Product Update Error: ${err.message}`)
            }
      
            // if( !prodIndex || !qty || typeof(prodIndex) !== 'number' || typeof(qty) !== 'number') {
            //       return errorHandler(socket, 'Invalid data or data types in cart updater. Values should be numbers')
            // }
            if(qty < 1 ) {
                  qty = 1
            }
            if (cart.cartProducts.length == 0) {
                  return errorHandler(socket, 'Your cart is empty. There is nothing to update.')
            }
      
            //This is a checker to check for product presence in cart using index
            const productToUpdate = cart.cartProducts[prodIndex]
            if( !productToUpdate) {
                 return errorHandler(socket, 'Product not in array')
            }
           
            const validateAgainstProductStock = async (productToUpdate) => {
                  try{
                        const {inStock} = await Product.findById(productToUpdate.id)
                        if(qty > inStock) {
                             const difference = qty - inStock
                             throw new Error(`Quantity more than available in stock by ${difference}`)
                        }else {
                              successMessageHandler(socket,'')
                        }
                  }
                  catch(err) {
                        return errorHandler(socket, err.message)
                  }
                  
            }
            validateAgainstProductStock(productToUpdate)
      
            let subTotal
            const {discount, discountType} = productToUpdate
            if(discountType === 'percent') {
                 const discountValue =  Number(discount/100) * Number(qty * productToUpdate.price)
                 subTotal = Number(qty * productToUpdate.price) - discountValue
            }else if (discountType === 'flat') {
                 subTotal = Number(qty * productToUpdate.price) - discount
            }else{
                  errorHandler(socket,'FATAL ERROR. PLEASE CONTACT THE SYSTEM ADMIN')
            }
      
            //Update of product alone
            [productToUpdate.qty, productToUpdate.subTotal] = [qty,subTotal]
      
            //Update of product in cart
            cart.cartProducts[prodIndex] = productToUpdate
            cart.cartTotal = totalCalculator(cart.cartProducts)
      
            const {cartTotal} = cart
            
            socket.emit('upt_result',{prodIndex, productToUpdate,cartTotal})

      }catch(err) {
            return errorHandler(socket,err)
      }
      //Destructure product index and index from the request
     
}

//Function to delete from cart
const deleteFunc = (socket,cart,prodIndex) => {
      //Checking product index validity
      try {
            validateIfNumber(prodIndex, 'Deletion Error: product index is not present or is Invalid(Should be number)')
         }
         catch(err) {
             return errorHandler(socket, `Deletion Error: ${err.message}`)
      }
   
      //Checking product availability
      const productToDelete = cart.cartProducts[prodIndex]
      if(!productToDelete) {
            return errorHandler(socket, 'Product to delete is not in cart')
      }

      //Actual deletion
      cart.cartProducts.splice(prodIndex, 1)
      cart.cartTotal = totalCalculator(cart.cartProducts)

      const {cartTotal} = cart
      //The command
      socket.emit('delete_command',{prodIndex, cartTotal})
      successMessageHandler(socket, `${productToDelete.name} removed from cart`)
}

//Cart discounting function
const cartDiscounter = (socket,cart,data) => {
      const {discount,type} = data
     
      try {
         if(cart.cartProducts.length < 1) {
           return errorHandler(socket, 'Discounting Error: Cart is empty')
         }
         validateIfNumber(discount, 'Discounting Error: Discount VALUE is not present or is Invalid')
         validateIfString(type, 'Discounting Error: Discount TYPE is not present or is Invalid')
      }
      catch(err) {
          return errorHandler(socket, `Discounting Error : ${err.message}`)
      }

      const resultEmmiter = () => {
            const {cartGeneralDiscount, cartTotal} = cart
            socket.emit('discount_result',{cartGeneralDiscount,cartTotal})
      }

      if(type.toUpperCase() == 'FLAT'){
          cart.cartTotal = cart.cartTotal - discount
          cart.cartGeneralDiscount = `${discount} (flat)` 
          
          resultEmmiter()
      }
      else if(type.toUpperCase() == 'PERCENT') {
          cart.cartTotal = cart.cartTotal - ((Number(discount)/100) * cart.cartTotal)
          cart.cartGeneralDiscount = `${discount}%`

          resultEmmiter()
      }else {
         errorHandler(socket, 'Discount error: Please check your values(Discount type parameter should be FLAT OR PERCENT)')
      }
      
}


const calculateTotals = async (socket) => {
      const cart = {
            cartProducts :[],
            cartTotal: 0,
            cartGeneralDiscount:0,
      }
      const payDetails = {
            expenditure : Number(cart.cartTotal),
            payed : 0,
            change:0,
      }

      socket.on('add_to_cart', async (data) => {
              await addFunc(socket,cart,data)
              paymentFunc(socket,cart,payDetails,payDetails.payed)
      })
      socket.on('update_qty', (data) => {
            updatorFunc(socket,cart,data)
            paymentFunc(socket,cart,payDetails,payDetails.payed)
      })
      socket.on('delete_from_cart', (prodIndex) => {
             deleteFunc(socket,cart,prodIndex)
             paymentFunc(socket, cart, payDetails, payDetails.payed)
      })
      socket.on('discount_cart', (data) => {
            cartDiscounter(socket,cart,data)
            paymentFunc(socket,cart, payDetails,payDetails.payed)
      }) 
      socket.on('payment', (amount) => {
            paymentFunc(socket,cart,payDetails,amount)
      })
      socket.on('confirm_payment', (data) => {
            confirmPaymentFunc(socket,cart,payDetails,data)
      })
      socket.on('print-invoice',(invoiceName) => {
            printInvoice(socket, invoiceName)
      })
      socket.on('email-invoice',(invoiceName, reEmail) => {
            emailInvoice(socket, invoiceName, reEmail)
      })
      socket.on('cart-cleanup', () => {
            clearCart(socket,cart, payDetails)
      })
      socket.on('hold-sale', () => {
            
      })
}
module.exports = {calculateTotals}

