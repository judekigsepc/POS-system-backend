const Transaction = require("../models/transaction.model")
const Product = require("../models/product.model")

const {timeSetter} = require('../utils/util')
const { errorHandler } = require("../utils/util") 

//Function to handle payment
const paymentFunc = (socket,cart,payDetails,payment) => {
    if(!payment || typeof(payment) !== 'number') {
          return errorHandler(socket,'Payment Error: Payment parameter should be number')
    }
    const {cartTotal} = cart
    const change = Number(payment) - cartTotal
    if (change < 0) {
          return errorHandler(socket, 'Payment error: payed amount is not enough to cover expenditure')
    }
    payDetails.expenditure = cartTotal
    payDetails.payed = Number(payment)
    payDetails.change = change
    socket.emit('pay_result', payDetails)
}

//Function to confirm payment, generate receipt and update iinventory
const confirmPaymentFunc = async (socket,cart,payDetails,data) => {
    const {type,notes,executor} =  data
    const {expenditure,payed,change} = payDetails
    const {cartProducts,cartTotal,cartGeneralDiscount} = cart
    
    if(!type || !notes || !executor || !expenditure || !payed || !change) {
        return errorHandler(socket, 'Payment Confirmation error: Payment details or confirmation info may be missing or invalid')
    }

    const itemsArray = []
    cartProducts.forEach((product) => {
          item = {
                itemId: product.id,
                name: product.name,
                itemQty: product.qty,
                unitPrice: product.price,
                discount:`${product.discount}`,
                subTotal: product.subTotal
          }
          itemsArray.push(item)
    })
   
    const transaction = {
          items : itemsArray,
          transDate: await timeSetter(),
          executor: executor,
          transactionTotal: expenditure,
          discount: cartGeneralDiscount,
          payedAmount: payed,
          change: change,
          paymentMethod:'Cash',
          paymentStatus:'Completed',
          type:type,
          notes:notes,
    }
    try{
      const savedTransaction = await Transaction.create(transaction)   
      cart.cartProducts = []
      cart.cartGeneralDiscount = 0
    }
    catch(err) {
      return errorHandler(socket,err)
    }
   
}

module.exports = {
    paymentFunc,
    confirmPaymentFunc,
}
