const Transaction = require("../models/transaction.model")

const {timeSetter, errorHandler, messageHandler, successMessageHandler} = require('../utils/util')
const { validateIfNumber, validateIfString, validateMultipleStrings, validateMultipleNumbers } = require("../utils/validationUtils")

const { generateInvoice} = require("./docFunctions")

//Function to handle payment
const paymentFunc = (socket,cart,payDetails,payment) => {
      try{
            validateIfNumber(payment,'Payment Error: Payment value not present or Invalid(Should be string)')
        }
        catch(err) {
            return errorHandler(socket, err.message)
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
  
      try{
        messageHandler(socket, 'task', 'Processing transaction')
        
        const error = 'Transactuion Error: Payment Confirmation error: Payment details or confirmation info may be missing or invalid'
        validateMultipleStrings([type, notes, executor], error)
        validateMultipleNumbers([expenditure,payed,change],error )
      }
      catch(err) {
            return errorHandler(socket, `Transaction Error: ${err.message}`)
      }

    try{
     
      if(!type || !notes || !executor || !expenditure || !payed || !change) {
          return errorHandler(socket, 'Transactuion Error: Payment Confirmation error: Payment details or confirmation info may be missing or invalid')
      }
  
      const itemsArray = []
  
      //Mapping cartProducts array to itemsArray for mongo db saving
      cartProducts.forEach((product) => {
            item = {
                  itemId: product.id,
                  name: product.name,
                  itemQty: product.qty,
                  unitPrice: product.price,
                  discount:`${product.discount}`,
                  discountType:product.discountType,
                  subTotal: product.subTotal
            }
            itemsArray.push(item)
      })
     
      //The trasaction document to be saved
      const transaction = {
            executor: executor,
            items : itemsArray,
            transDate: await timeSetter(),
            generalDiscount: cartGeneralDiscount,
            //     generalTax:generalTax,
            totalCostPrice: expenditure,
            payedAmount: payed,
            change: change,
            paymentMethod:'Cash',
            paymentStatus:'Completed',
            type:type,
            notes:notes,
      }


      const savedTransaction = await Transaction.create(transaction)  
      successMessageHandler(socket, 'Transaction proccessed successuly. Now generating invoice..')

      generateInvoice(socket, savedTransaction)
     //I should handle cart clearing logic here
     //Should also handle inventory updates
    }
    catch(err) {
      return errorHandler(socket,err)
    }
   
}

module.exports = {
    paymentFunc,
    confirmPaymentFunc,
}
