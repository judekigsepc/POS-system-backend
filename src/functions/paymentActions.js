const Transaction = require("../models/transaction.model")

const {timeSetter, errorHandler, messageHandler, successMessageHandler} = require('../utils/util')
const { validateIfNumber, validateMultipleStrings, validateMultipleNumbers } = require("../utils/validationUtils")

const { generateInvoice} = require("./docActions")
const {clearCart, inventoryUpdate} = require('./cartInventoryManager')
const {refundHandler} = require('./refundHandler')

//Function to handle payment
const paymentFunc = (socket,cart,payDetails,payment) => {
      try{
            validateIfNumber(payment,'Payment Error: Payment value not present or Invalid(Should be string)')
        }
        catch(err) {
            return errorHandler(socket, err.message)
        }

    const {cartTotal} = cart
    let change = Number(payment) - cartTotal
   
    payDetails.expenditure = cartTotal
    payDetails.payed = Number(payment)
    payDetails.change = change
    socket.emit('pay_result', payDetails)
}

//Function to confirm payment, generate receipt and update iinventory
const confirmPaymentFunc = async (socket,cart,payDetails,data) => {
      const {type,notes,executor} =  data
      const {expenditure,payed,change} = payDetails
  
      try{
        messageHandler(socket, 'task', 'Processing transaction')
        
        //Validation of strings and numbers in payment details and the provided transaction data
        const error = 'Transactuion Error: Payment Confirmation error: Payment details or confirmation info may be missing or invalid'
        validateMultipleStrings([type, notes, executor], error)
        validateMultipleNumbers([expenditure,payed,change],error )

        //Checking to if the money paid is enough to cover the expenditure
        if(change < 0) {
            return errorHandler(socket, `Paid amount is not enough to cover expenditure`)
        }
      }
      catch(err) {
            return errorHandler(socket, `Transaction Error: ${err.message}`)
      }

    try{
     
      // //Checking for vital info presence
      if(!type || !notes || !executor || !expenditure || !payed) {
          return errorHandler(socket, 'Transactuion Error: Payment Confirmation error: Payment details or confirmation info may be missing or invalid')
      }
    
      //Handling transaction if refund(involves return of goods)
      if(type === 'refund') {
            const savedTransaction = await transactionSaver(socket,cart,payDetails,data)
            return refundHandler(socket,savedTransaction)
      }
     
      //Passing to the function that handles saving
      transactionSaver(socket,cart,payDetails,data,'exec')
    }
    catch(err) {
      return errorHandler(socket,err)
    }
   
}

const transactionSaver = async (socket, cart,payDetails,data,exec) => {
      const {type,notes,executor} =  data
      const {expenditure,payed,change} = payDetails
      const {cartProducts,cartGeneralDiscount} = cart

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
      
      //Saving the transaction to the database
      const savedTransaction = await Transaction.create(transaction)  
      successMessageHandler(socket, 'Transaction proccessed successuly. Post processing..')

      //Passing to transaction post processing function
     if(exec) {
      return transactionPostProcesser(socket,cart,savedTransaction,payDetails)
     }
     return savedTransaction
}

const transactionPostProcesser = async (socket,cart,savedTransaction,payDetails) => {
      try {
            await Promise.all([
                  inventoryUpdate(socket, savedTransaction),
                  generateInvoice(socket, savedTransaction),
                  clearCart(socket, cart,payDetails)
            ])
      }
      catch (err){
           errorHandler(socket, err.message)
      }
      
}

module.exports = {
    paymentFunc,
    confirmPaymentFunc,
}
