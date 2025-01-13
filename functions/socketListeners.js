
const {paymentFunc, confirmPaymentFunc} = require('./paymentActions')
const {printInvoice, emailInvoice} = require('./invoiceActions')
const { clearCart } = require('./cartInventoryManager')
const { holdSale,resumeHeldSale } = require('./saleHoldActions')
const { addToCart,updateInCart,deleteInCart,discountCart } = require('./cartActions')
const {calculateCollection} = require('./collectionActions')
const { successMessageHandler } = require('../utils/util')


const cartSocketListeners = async (socket) => {
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
      
      socket.on('get_full_cart',() => {
            socket.emit('full_cart_result',(cart))
            successMessageHandler(socket, 'Loaded full cart')
      })

      socket.on('add_to_cart', async (data) => {
              await addToCart(socket,cart,data)
              paymentFunc(socket,cart,payDetails,payDetails.payed)
      })
      socket.on('update_qty', async (data) => {
            await updateInCart(socket,cart,data)
            paymentFunc(socket,cart,payDetails,payDetails.payed)
      })
      socket.on('delete_from_cart', (prodIndex) => {
             deleteInCart(socket,cart,prodIndex)
             paymentFunc(socket, cart, payDetails, payDetails.payed)
      })
      socket.on('discount_cart', (data) => {
            discountCart(socket,cart,data)
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
      socket.on('hold-sale', (executor) => {
            holdSale(socket,cart,executor)
      })
      socket.on('resume-sale',(saleId) => {
            resumeHeldSale(socket,cart,saleId)
      })
      socket.on('calculate-collection', (data) => {
            calculateCollection(socket,data)   
      }) 
}
module.exports = cartSocketListeners

