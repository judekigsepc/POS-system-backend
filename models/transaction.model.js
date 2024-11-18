const mongoose = require('mongoose')
const {Schema} = mongoose

const {timeSetter} = require('../utils/util.js')

const itemSubSchema = new Schema({
    item: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: true,
    },
    itemQty:{
        type:Number,
        required:true,
        min:1
    },
    unitPrice:{
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
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Mobile Money', 'Bank Transfer'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Canceled', 'Refunded'],
      default: 'Pending',
    },
    notes: {
      type: String,
      default: '',
    },
  });
  
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