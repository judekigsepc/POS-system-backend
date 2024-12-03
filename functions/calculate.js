const Product = require('../models/product.model')
const Transaction = require('../models/transaction.model')

const {errorHandler} = require('../utils/util')
const {paymentFunc, confirmPaymentFunc} = require('./payments')

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
            errorHandler(socket,'No product id')
         }
         if (!data.qty) {
               data.qty = 1
         }

         const {name, price,taxes,discount,discountType,units,sku,_id} = await Product.findById(data.prodId)
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

         const exisitingProduct = cart.cartProducts.some(prod => prod.name == product.name)
         if(exisitingProduct) {
            return errorHandler(socket, 'Product already in cart')
            return cart.cartProducts.some(prod => prod.name == product.name).qty += 1
         }
         cart.cartProducts.push(product)
         cart.cartTotal = totalCalculator(cart.cartProducts)
         
         const {cartTotal} = cart
         socket.emit('result',{product, cartTotal})
}

const updatorFunc = (socket,cart,data) => {
      //Destructure product index and index from the request
      const {prodIndex, qty} = data 

      //Check for presence and validity of the data types
      //TODO : FIX ZERO VALIDATION ISSUE
      if( !prodIndex || !qty || typeof(prodIndex) !== 'number' || typeof(qty) !== 'number') {
            return errorHandler(socket, 'Invalid data or data types in cart updater. Values should be numbers')
      }
      else if (cart.cartProducts.length == 0) {
            return errorHandler(socket, 'Your cart is empty. There is nothing to update.')
      }

      //This is a checker to check for product presence in cart using index
      const productToUpdate = cart.cartProducts[prodIndex]
      if( !productToUpdate) {
           return errorHandler(socket, 'Product not in array')
      }

      //Calculate sub total
      const subTotal = productToUpdate.price * qty;

      //Update of product alone
      [productToUpdate.qty, productToUpdate.subTotal] = [qty,subTotal]

      //Update of product in cart
      cart.cartProducts[prodIndex] = productToUpdate
      cart.cartTotal = totalCalculator(cart.cartProducts)

      const {cartTotal} = cart
      
      socket.emit('upt_result',{prodIndex, productToUpdate,cartTotal})
}

//Function to delete from cart
const deleteFunc = (socket,cart,prodIndex) => {
      //Checking product index validity
      if (!prodIndex || typeof(prodIndex) !== 'number') {
            errorHandler(socket, 'Deletion Error : Invalid deletion parameter. Should be string')
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
}

//Cart discounting function
const cartDiscounter = (socket,cart,data) => {
      const {discount,type} = data
      if (typeof(discount) !== 'number') {
           return errorHandler(socket,'Discount error: discount parameter should be number')
      }

      const resultEmmiter = () => {
            const {cartGeneralDiscount, cartTotal} = cart
            socket.emit('discount_result',{cartGeneralDiscount,cartTotal})
      }

      if(type === 'flat'){
          cart.cartTotal = cart.cartTotal - discount
          cart.cartGeneralDiscount = `${discount} - flat` 
          
          resultEmmiter()
      }
      else if(type === 'percent') {
          cart.cartTotal = cart.cartTotal - ((Number(discount)/100) * cart.cartTotal)
          cart.cartGeneralDiscount = `${discount}%`    
          
          resultEmmiter()
      }else {
         errorHandler(socket, 'Discount error: Please check your values')
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
              addFunc(socket,cart,data)
      })
      socket.on('update_qty', (data) => {
            updatorFunc(socket,cart,data)
      })
      socket.on('delete_from_cart', (prodIndex) => {
             deleteFunc(socket,cart,prodIndex)
      })
      socket.on('discount_cart', (data) => {
            cartDiscounter(socket,cart,data)
      }) 
      socket.on('payment', (amount) => {
            paymentFunc(socket,cart,payDetails,amount)
      })
      socket.on('confirm_payment', (data) => {
            confirmPaymentFunc(socket,cart,payDetails,data)
      })
}
module.exports = {calculateTotals}

