const { required } = require('joi')
const mongoose = require('mongoose')

const prodSubSchema = new mongoose.Schema({
    prodId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    qty: {
        type:Number,
        required:true
    }
})
const saleHoldSchema = mongoose.Schema({
    identifier:{
        type: String,
        required: true
    },
    products:[prodSubSchema],

    collections: {
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Collection',
        required: true
    },
    executor : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    reason : {
        type:String,
        default:'No reason specified'
    },
    status: {
        type:String,
        enum: ['held','resumed'],
    }
},{timestamps:true})


const HeldSale = mongoose.model('heldSale',saleHoldSchema)

module.exports = HeldSale

