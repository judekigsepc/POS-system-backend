const mongoose = require('mongoose')
const {Schema} = mongoose

const {timeSetter} = require('../utils/util.js')

const itemSubSchema = new Schema({
    itemId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: true,
    },
    name: {
      type:String,
      required:true,
    },
    itemQty:{
        type:Number,
        required:true,
        min:1
    },
    unitPrice:{
        type:Number,
        required:true,
    },
    discount:{
        type:String,
        required:true,
    },
    subTotal :{
      type:Number,
      required:true,
    }
})

const transactionSchema = new Schema({
    items: [itemSubSchema],
    transDate: {
      type: Date,
    },
    executor: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: String,
      default: 0,
    },
    payedAmount: {
      type:Number,
      required:true,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Mobile Money', 'Bank Transfer'],
      required: true,
    },
    type:{
      type:String,
      enum:['purchase','refund'],
      required:true,
    },
    notes: {
      type: String,
      default: '',
    },
  },{timestamps:true});
  
transactionSchema.pre('save', async function (next) {
    try {
        const time = await timeSetter()
        this.transDate = time
        next()
    }catch(err){
       next(err)
    }
})

const Transaction = mongoose.model('Transaction',transactionSchema)

module.exports = Transaction