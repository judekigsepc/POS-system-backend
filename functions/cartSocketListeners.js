
const {paymentFunc, confirmPaymentFunc} = require('./paymentActions')
const {printInvoice, emailInvoice} = require('./invoiceActions')
const { clearCart } = require('./cartInventoryManager')
const { holdSale,resumeHeldSale } = require('./saleHoldActions')
const { addToCart,updateInCart,deleteInCart,discountCart } = require('./cartActions')


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

      socket.on('add_to_cart', async (data) => {
              await addToCart(socket,cart,data)
              paymentFunc(socket,cart,payDetails,payDetails.payed)
      })
      socket.on('update_qty', (data) => {
            updateInCart(socket,cart,data)
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
      socket.on('resume-sale',() => {
            resumeHeldSale(socket,id,cart)
      })
}
module.exports = cartSocketListeners

